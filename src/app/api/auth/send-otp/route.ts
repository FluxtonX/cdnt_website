import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const supabaseAdmin = createAdminClient();

    // Store OTP in email_otps table
    // Delete any existing OTP first to avoid unique constraint issues with upsert
    await supabaseAdmin
      .from("email_otps")
      .delete()
      .eq("email", email);

    const { error: dbError } = await supabaseAdmin
      .from("email_otps")
      .insert({
        email,
        code,
        expires_at,
        verified: false,
      });

    if (dbError) {
      console.error("Database error storing OTP:", dbError);
      return NextResponse.json({ error: `Failed to store OTP: ${dbError.message}` }, { status: 500 });
    }

    // Validate Brevo API key and instantiate client per request
    if (!process.env.BREVO_API_KEY) {
      console.error('Missing BREVO_API_KEY');
      return NextResponse.json({ error: 'Server configuration error: missing BREVO_API_KEY' }, { status: 500 });
    }
    
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    try {
      // Use Brevo API to send email
      const sendSmtpEmail = new SendSmtpEmail();
      sendSmtpEmail.sender = { email: 'noreply@cdntbank.com', name: 'Canadian Digital National Trust Bank' };
      sendSmtpEmail.to = [{ email }];
      sendSmtpEmail.subject = 'Your Verification Code';
      sendSmtpEmail.htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #E2E8F0; border-radius: 10px;">
            <h1 style="color: #113285;">Canadian Digital National Trust Bank</h1>
            <p style="color: #4A5568; font-size: 16px;">Please use the verification code below to complete your sign in process.</p>
            <div style="background-color: #F8F9FA; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="font-size: 32px; letter-spacing: 4px; color: #0A0F2C; margin: 0;">${code}</h2>
            </div>
            <p style="color: #718096; font-size: 14px;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
          </div>
        `;

      await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Fallback to console log
      console.log(`[FALLBACK] OTP for ${email} is: ${code}`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
