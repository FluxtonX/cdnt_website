"use client";

import { Shield } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Change Password Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Change Password</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Update your password regularly for security</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">Current Password</label>
            <input 
              type="password" 
              placeholder="Enter current password"
              defaultValue="Abc"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285]" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              defaultValue="Abc"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285]" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#0A0F2C]">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password"
              defaultValue="Abc"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[15px] text-[#0A0F2C] outline-none transition-colors focus:border-[#113285] focus:ring-1 focus:ring-[#113285]" 
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="rounded-xl bg-[#113285] px-6 py-3 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* Two-Factor Authentication Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Two-Factor Authentication</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Add an extra layer of security</p>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-[#F4F8FF] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <Shield className="h-6 w-6 text-[#38A169]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#0A0F2C]">Authenticator App</p>
              <p className="text-[14px] text-[#718096] mt-0.5">Google Authenticator, Authy</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
            Enabled
          </span>
        </div>

        <button className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[14px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2">
          Reconfigure 2FA
        </button>
      </section>

      {/* Active Sessions Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Active Sessions</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Manage your active login sessions</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
            <div>
              <p className="text-[15px] font-bold text-[#0A0F2C]">Chrome on MacOS</p>
              <p className="text-[14px] text-[#718096] mt-0.5">Toronto, ON • Active now</p>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
              Current
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
            <div>
              <p className="text-[15px] font-bold text-[#0A0F2C]">Mobile App on iPhone</p>
              <p className="text-[14px] text-[#718096] mt-0.5">Toronto, ON • 2 hours ago</p>
            </div>
            <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2">
              Revoke
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
