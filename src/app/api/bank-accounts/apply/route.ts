import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await request.json();
    const {
      account_category,
      account_type,
      account_name,
      currency = "CAD",
      initial_deposit = 0.00,
    } = body;

    if (!account_name || !account_type) {
      return NextResponse.json({ error: "Missing account details." }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Insert bank account application
    const { data: newAccount, error: accErr } = await supabaseAdmin
      .from("user_bank_accounts")
      .insert({
        user_id: user.id,
        account_category: account_category || "everyday",
        account_type,
        account_name,
        currency,
        balance: Number(initial_deposit) || 0.00,
        status: "pending",
      })
      .select()
      .single();

    if (accErr) {
      console.error("Error creating bank account:", accErr);
      return NextResponse.json({ error: accErr.message }, { status: 500 });
    }

    // 2. Fetch user display name / email for notification
    let clientIdentifier = user.email || "A client";
    try {
      const { data: profile } = await supabaseAdmin
        .from("user_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.full_name) {
        clientIdentifier = `${profile.full_name} (${user.email})`;
      }
    } catch {
      // ignore
    }

    // 3. Insert Admin Notification using service role
    try {
      await supabaseAdmin.from("notifications").insert({
        audience: "Admin",
        type: "Info",
        title: "New Bank Account Application",
        message: `${clientIdentifier} applied to open a new ${account_name} (${currency}).`,
        is_read: false,
        link: "/dashboard/bank-accounts",
      });
    } catch (notifErr) {
      console.error("Error inserting admin notification:", notifErr);
    }

    return NextResponse.json({ success: true, account: newAccount });
  } catch (err: any) {
    console.error("Apply Bank Account Route Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
