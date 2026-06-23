import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validatePasswordRules(password: string) {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

export function calculateCADBalance(wallets: any[], rates: { btcCAD: number; ethCAD: number; usdtCAD: number }) {
  const btcBal = Number(wallets?.find((w: any) => w.currency === "BTC")?.balance || 0);
  const ethBal = Number(wallets?.find((w: any) => w.currency === "ETH")?.balance || 0);
  const usdtBal = Number(wallets?.find((w: any) => w.currency === "USDT")?.balance || 0);

  return (btcBal * rates.btcCAD) + (ethBal * rates.ethCAD) + (usdtBal * rates.usdtCAD);
}

let cachedRates: { btcCAD: number; ethCAD: number; usdtCAD: number } | null = null;
let lastFetchTime = 0;

export async function fetchLiveCADRates() {
  const now = Date.now();
  if (cachedRates && now - lastFetchTime < 60000) {
    return cachedRates;
  }

  try {
    const coinGeckoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=cad"
    );
    const coinGeckoData = await coinGeckoRes.json();

    cachedRates = {
      btcCAD: coinGeckoData?.bitcoin?.cad || 90000,
      ethCAD: coinGeckoData?.ethereum?.cad || 4500,
      usdtCAD: coinGeckoData?.tether?.cad || 1.36,
    };
    lastFetchTime = now;
  } catch (error) {
    console.error("Failed to fetch live CAD rates, using defaults", error);
    if (!cachedRates) {
      cachedRates = {
        btcCAD: 90000,
        ethCAD: 4500,
        usdtCAD: 1.36,
      };
    }
  }

  return cachedRates!;
}
