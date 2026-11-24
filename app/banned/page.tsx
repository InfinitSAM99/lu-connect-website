"use client";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-red-900/30 rounded-[24px] p-8 shadow-2xl text-center">
        
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Account Suspended</h1>
        
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Your LU Connect account has been suspended for violating our community guidelines. 
          You cannot access the app or website at this time.
        </p>

        <div className="bg-black border border-[#1f1f1f] rounded-xl p-4 mb-8 text-left">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reason</p>
          <p className="text-sm text-gray-300">Multiple reports of inappropriate content or behavior.</p>
        </div>

        <a 
          href="mailto:support@luconnect.com?subject=Appeal%20for%20Banned%20Account"
          className="block w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-3 rounded-xl transition-all mb-4"
        >
          Appeal via Email
        </a>
        
        <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

      </div>
    </div>
  );
}
