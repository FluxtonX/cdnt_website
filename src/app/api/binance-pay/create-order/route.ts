import { NextResponse } from "next/server";
import crypto from "crypto";

// Note: This implementation uses a best-effort signing method (HMAC-SHA512 over timestamp+body)
// and the common v2 order endpoint path. Verify against Binance Pay docs and update the
// header names / signing algorithm if their spec differs for your merchant account.

export async function POST(req: Request) {
  try {
    const { amount, asset, reference } = await req.json();

    if (!amount || !asset) {
      return NextResponse.json({ error: "Missing amount or asset" }, { status: 400 });
    }

    const API_KEY = process.env.BINANCE_PAY_API_KEY;
    const SECRET = process.env.BINANCE_PAY_SECRET_KEY;
    const BASE = process.env.BINANCE_PAY_BASE_URL || "https://bpay.binanceapi.com";

    if (!API_KEY || !SECRET) {
      return NextResponse.json({ error: "Binance Pay keys not configured" }, { status: 500 });
    }

  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");

    // Build a minimal order payload. Add or change fields to match your Binance Pay
    // merchant account requirements (notifyUrl, returnUrl, productDetail, etc.).
    const currency = asset === "USDT" ? "USDT" : asset;
    const merchantTradeNo = reference || `NUD-${Date.now().toString(36).toUpperCase()}`;

    const orderPayload = {
      merchantTradeNo,
      totalFee: Number(amount),
      currency,
      // productType, product details and merchant info may be required by Binance Pay
      productType: "PHYSICAL",
      productName: `NU Deposit ${currency}`,
      // optional: notifyUrl and returnUrl can be configured via env
      notifyUrl: process.env.BINANCE_PAY_NOTIFY_URL || undefined,
      returnUrl: process.env.BINANCE_PAY_RETURN_URL || undefined,
    };

    const body = JSON.stringify(orderPayload);

  // Best-effort signature: include nonce and use HMAC-SHA512 over timestamp + nonce + body.
  // If Binance requires a different prehash (newlines or different order) we'll adjust after
  // inspecting error responses.
  const hmac = crypto.createHmac("sha512", SECRET);
  hmac.update(timestamp + nonce + body);
  const signature = hmac.digest("hex");

    const endpoint = `${BASE}/binancepay/openapi/v2/order`;

    const CERT_SN = process.env.BINANCE_PAY_CERTIFICATE_SN;

    if (!CERT_SN) {
      return NextResponse.json({ error: "Missing BINANCE_PAY_CERTIFICATE_SN in server environment. Set BINANCE_PAY_CERTIFICATE_SN in .env.local" }, { status: 500 });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include nonce header which the API reported as mandatory.
        "BinancePay-Timestamp": timestamp,
        "BinancePay-Nonce": nonce,
        // Certificate serial number header is required by Binance Pay
        "BinancePay-Certificate-SN": CERT_SN ?? "",
        "BinancePay-API-Key": API_KEY,
        "BinancePay-Signature": signature,
      },
      body,
    });

    const text = await response.text().catch(() => "");
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }

    // Log request/response for debugging (dev only). Remove or guard in production.
  console.error("[binance-pay] request ->", { endpoint, body, headers: { timestamp, nonce, certificateSN: CERT_SN, apiKey: API_KEY, signature } });
    console.error("[binance-pay] response ->", { status: response.status, statusText: response.statusText, text, data });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Binance Pay create-order failed",
          status: response.status,
          statusText: response.statusText,
          text,
          data,
        },
        { status: 502 },
      );
    }

    // Return the raw API response to the client so the UI can extract payUrl / qrCode
    return NextResponse.json({ ok: true, status: response.status, statusText: response.statusText, data, text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
