"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/two-factor");
  };

  return (
    <div className="min-h-screen bg-[#1855C0] bg-gradient-to-br from-[#1C5BD0] to-[#123E95] flex flex-col items-center justify-center p-6 relative">
      
      {/* Back to home arrow */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-6 flex justify-center">
          <Image 
            src="/cdnt-logo.png" 
            alt="CDNT Bank Logo" 
            width={240} 
            height={80} 
            className="h-16 w-auto object-contain"
            priority
            unoptimized={true}
          />
        </div>
        <h1 className="text-white text-3xl font-bold mb-3">Welcome Back</h1>
        <p className="text-blue-100 text-[15px]">Sign in to your CDNT account</p>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-[420px] rounded-[24px] p-8 md:p-10 shadow-2xl shadow-black/20">
        <form className="space-y-6" onSubmit={handleLogin}>
          
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">Email Address</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#0A0F2C]">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent transition-all placeholder:text-gray-400"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-[#1A3FBB] focus:ring-[#1A3FBB]" 
              />
              <span className="text-[14px] font-bold text-[#0A0F2C]">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-[14px] text-[#1A3FBB] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#113285] hover:bg-[#0D266A] text-white font-bold text-[15px] py-4 rounded-xl transition-colors shadow-md mt-2"
          >
            Continue
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[14px] text-gray-500">
            Don't have an account? <Link href="/register" className="text-[#113285] font-bold hover:underline">Sign up now</Link>
          </p>
        </div>
      </div>

      {/* Footer text */}
      <p className="text-blue-200/70 text-sm mt-8">
        Protected by bank-grade encryption and security
      </p>

    </div>
  );
}
