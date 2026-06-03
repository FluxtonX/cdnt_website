import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const resetSessionId = cookieStore.get("reset_session_id")?.value;

    if (!resetSessionId) {
      return NextResponse.json({ error: "No active reset session found. Please request a new code." }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch the temporary session from email_otps
    const { data: sessionRecord, error: fetchError } = await supabaseAdmin
      .from("email_otps")
      .select("*")
      .eq("code", resetSessionId)
      .eq("verified", true)
      .single();

    if (fetchError || !sessionRecord) {
      return NextResponse.json({ error: "Invalid or expired reset session. Please request a new code." }, { status: 401 });
    }

    const now = new Date().getTime();
    const expiresAt = new Date(sessionRecord.expires_at).getTime();

    if (now > expiresAt) {
      // Clean up expired session
      await supabaseAdmin.from("email_otps").delete().eq("code", resetSessionId);
      return NextResponse.json({ error: "Reset session has expired. Please request a new code." }, { status: 401 });
    }

    const email = sessionRecord.email;

    // 2. Find the user ID by email using the profiles table
    // (Assuming profiles table has id matching auth.users.id)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      console.error("Profile not found for email:", email, profileError);
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const userId = profile.id;

    // 3. Update the user's password using the Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: password,
    });

    if (updateError) {
      console.error("Failed to update password:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 4. Cleanup the session from database
    const { error: deleteError } = await supabaseAdmin
      .from("email_otps")
      .delete()
      .eq("code", resetSessionId);

    if (deleteError) {
      console.error("Error deleting reset session from db:", deleteError);
    }

    // 5. Clear the cookie
    cookieStore.delete("reset_session_id");

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
