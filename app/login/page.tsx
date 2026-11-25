"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!captchaToken) {
      setError("Please complete the security check.");
      setLoading(false);
      return;
    }

    // 1. Verify the Turnstile token via our API
    const verifyRes = await fetch('/api/verify-captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: captchaToken })
    });
    const verifyData = await verifyRes.json();
    
    if (!verifyData.success) {
      setError("Security check failed. Please try again.");
      setLoading(false);
      turnstileRef.current?.reset();
      return;
    }

    // 2. Attempt Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      turnstileRef.current?.reset(); // Reset CAPTCHA on failure
      
      // Log the failed attempt
      fetch('/api/log-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          status: 'failed', 
          reason: authError.message.includes('confirmed') ? 'email_not_confirmed' : 'wrong_password' 
        })
      }).catch(() => {});
      return;
    }

    if (authData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('approval_status, is_suspended, suspension_reason')
        .eq('id', authData.user.id)
        .single();

      if (profile?.approval_status === 'banned' || profile?.is_suspended) {
        window.location.href = "/banned";
        return;
      }
    }

    window.location.href = "/account";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 py-12">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f1f] rounded-[24px] p-8 shadow-2xl">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Log in to manage your LU Connect account.</p>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-black border border-[#1f1f1f] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#ef4444] transition-colors"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-black border border-[#1f1f1f] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#ef4444] transition-colors"
            />
          </div>

          {/* Turnstile Widget */}
          <div className="my-6 flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setCaptchaToken(token)}
              options={{ theme: 'dark' }}
            />
          </div>

          <div className="flex justify-end mb-6">
            <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-[#ef4444] transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
