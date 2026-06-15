"use client";

import { Smartphone } from "lucide-react";

export default function DevicesSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Trusted Devices Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#0A0F2C]">Trusted Devices</h2>
          <p className="mt-1 text-[14px] text-[#718096]">Manage devices that can access your account</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4F8FF]">
                <Smartphone className="h-6 w-6 text-[#113285]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0A0F2C]">MacBook Pro</p>
                <p className="text-[14px] text-[#718096] mt-0.5">Toronto, ON • Active now</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
                Trusted
              </span>
              <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2 ml-auto sm:ml-0">
                Remove
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4F8FF]">
                <Smartphone className="h-6 w-6 text-[#113285]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0A0F2C]">iPhone 15 Pro</p>
                <p className="text-[14px] text-[#718096] mt-0.5">Toronto, ON • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <span className="inline-flex shrink-0 items-center rounded-full bg-[#C6F6D5] px-3 py-1 text-[12px] font-bold text-[#22543D]">
                Trusted
              </span>
              <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2 ml-auto sm:ml-0">
                Remove
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4F8FF]">
                <Smartphone className="h-6 w-6 text-[#113285]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0A0F2C]">iPad Air</p>
                <p className="text-[14px] text-[#718096] mt-0.5">Montreal, QC • 1 week ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-[#0A0F2C] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#113285] focus:ring-offset-2 ml-auto sm:ml-0">
                Remove
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
