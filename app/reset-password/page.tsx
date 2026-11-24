"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (tokenHash && type === 'recovery') {
      const verifyToken = async () => {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });
        
        if (error) {
          setError("The reset link is invalid or has expired. Please request a new one.");
        } else {
          setIsReady(true);
        }
      };
      verifyToken();
    } else {
      setError("Auth session missing! Please use the link from your email.");
    }
  }, [searchParams, supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);
      setTimeout(() => router.push("/help"), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="text-center bg-surface border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">Password Updated</h1>
          <p className="text-muted text-sm mb-6">Your password has been successfully changed. Redirecting to login...</p>
          <Link href="/help" className="text-luGold font-bold hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-[24px] p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-muted text-sm">
            {isReady ? "Enter your new password below." : "Verifying secure link..."}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-sm text-muted mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-black border border-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-luGold transition-colors"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-muted mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-black border border-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-luGold transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isReady}
            className="w-full bg-luRed hover:bg-[#dc2626] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
