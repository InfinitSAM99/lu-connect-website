"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // This sends the email using Supabase. 
    // It redirects to /reset-password with the token_hash!
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f1f] rounded-[24px] p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-gray-400 text-sm mb-6">
            We sent a password reset link to <strong>{email}</strong>. Please check your inbox.
          </p>
          <Link href="/login" className="text-[#ef4444] font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f1f] rounded-[24px] p-8 shadow-2xl">
        <Link href="/login" className="flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-black border border-[#1f1f1f] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#ef4444] transition-colors"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
