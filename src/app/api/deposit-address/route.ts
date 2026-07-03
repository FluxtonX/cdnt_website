import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cryptoParam = searchParams.get("crypto");
    const networkParam = searchParams.get("network");

    if (!cryptoParam) {
      return NextResponse.json({ error: "crypto param is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    let query = supabase
      .from("platform_wallets")
      .select("address")
      .eq("crypto", cryptoParam);
      
    if (networkParam) {
      query = query.eq("network", networkParam);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ address: data.address });
  } catch (err: any) {
    console.error("Error fetching deposit address:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
