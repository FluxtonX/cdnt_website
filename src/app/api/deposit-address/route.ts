import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Network name mapping to handle different naming conventions
function getPlatformNetworkName(crypto: string, network: string): string {
  const upperNetwork = network.toUpperCase();
  const upperCrypto = crypto.toUpperCase();
  
  if (upperCrypto === "BTC") {
    return "Bitcoin Mainnet";
  }
  if (upperCrypto === "ETH") {
    // Handle both "Ethereum (ERC20)" and "Ethereum Mainnet"
    if (upperNetwork.includes("ERC")) return "Ethereum Mainnet";
    return "Ethereum Mainnet";
  }
  if (upperCrypto === "USDT") {
    // USDT in platform_wallets uses "TRON (TRC-20) / Ethereum" for both networks
    return "TRON (TRC-20) / Ethereum";
  }
  return network;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cryptoParam = searchParams.get("crypto");
    const networkParam = searchParams.get("network");

    if (!cryptoParam) {
      return NextResponse.json({ error: "crypto param is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if user has a custom address for this crypto/network
    let userQuery = supabase
      .from("user_wallet_addresses")
      .select("address")
      .eq("user_id", user.id)
      .eq("crypto", cryptoParam.toUpperCase());
    
    if (networkParam) {
      userQuery = userQuery.eq("network", networkParam);
    }

    const { data: userAddress, error: userError } = await userQuery.limit(1).maybeSingle();

    if (userAddress && !userError) {
      return NextResponse.json({ address: userAddress.address });
    }

    // Fall back to platform wallets using admin client (bypasses RLS)
    const supabaseAdmin = createAdminClient();
    
    // Map network name to platform_wallets convention
    const platformNetwork = networkParam ? getPlatformNetworkName(cryptoParam, networkParam) : null;
    
    let platformQuery = supabaseAdmin
      .from("platform_wallets")
      .select("address")
      .eq("crypto", cryptoParam);
      
    if (platformNetwork) {
      platformQuery = platformQuery.eq("network", platformNetwork);
    }

    const { data, error } = await platformQuery.limit(1).maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return NextResponse.json({ address: data.address });
    }

    // Fall back to hardcoded addresses if platform wallet not found
    const fallbackAddresses: Record<string, string> = {
      BTC: "bc1q7q50t9edden65k94vjzqef0lx3vfjjv4klz5zy",
      ETH: "0x150B3BB98224598e20821De1A516A9fcC3bB65f9",
      USDT: networkParam?.toUpperCase().includes("TRC") ? "TVphkS3RjtbYV5TQAyNnc27Ae4BKFrV7QK" : "0x150B3BB98224598e20821De1A516A9fcC3bB65f9",
    };
    const fallbackAddress = fallbackAddresses[cryptoParam.toUpperCase()];
    
    if (fallbackAddress) {
      return NextResponse.json({ address: fallbackAddress });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err: any) {
    console.error("Error fetching deposit address:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
