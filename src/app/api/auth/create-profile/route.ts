import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Ensure a profile row exists for a newly registered user.
 * Expected payload: { email: string }
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Get the user record (includes user_metadata where we stored full_name)
    const { data: { users }, error: userErr } = await supabaseAdmin.auth.admin.listUsers();
    if (userErr) {
      console.error("Failed to fetch users for profile creation:", userErr);
      return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fullName = (user as any).user_metadata?.full_name?.trim();
    // Insert into profiles table – use upsert to avoid duplicate rows
    const { error: dbErr } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName || null,
        email_verified: false,
      }, { onConflict: "id" });

    if (dbErr) {
      console.error("Failed to upsert profile:", dbErr);
      return NextResponse.json({ error: dbErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("create-profile error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
