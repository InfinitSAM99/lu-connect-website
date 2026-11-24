"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HelpCenter() {
  const supabase = createClient();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<any>(null);

  // Auto-detect if a banned user is already logged in
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (data && (data.approval_status === 'banned' || data.approval_status === 'high_ban' || data.is_suspended)) {
          setStatus(data);
          setIssue("banned");
          setStep(3);
        }
      }
    }
    checkSession();
  }, [supabase]);

  const handleIssueSelect = (selectedIssue: string) => {
    setIssue(selectedIssue);
    setStep(2);
    setError("");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError("Incorrect password or email. Please try again.");
        setLoading(false);
        return;
      }

      const { data: profileData, error: dbError } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url, approval_status, is_suspended, suspended_reason")
        .eq("id", authData.user.id)
        .single();

      if (dbError) throw dbError;
      
      setStatus({ ...profileData, verified: true });
      setStep(3);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setStatus({ resetSent: true });
      setStep(3);
    } catch (err: any) {
      setError("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  const isBanned = status?.is_suspended || status?.approval_status === 'banned' || status?.approval_status === 'high_ban' || status?.approval_status === 'rejected';

  // FULL SCREEN BAN LAYOUT
  if (step === 3 && issue === "banned" && isBanned) {
    
  const handleOpenApp = () => {
    // Try to open the app using the deep link
    window.location.href = "luconnectnative://appeal";
    
    // Fallback: If the app isn't installed, take them to download after 2.5 seconds
    setTimeout(() => {
      window.location.href = "/download";
    }, 2500);
  };

  return (
      <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <span className="text-5xl">🚫</span>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-2">Account Banned</h1>
          <p className="text-muted text-lg mb-8 max-w-md">
            Your account has been suspended for violating our community guidelines.
          </p>

          <div className="w-full bg-[#111] border border-red-500/20 rounded-2xl p-6 mb-8 text-left shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <img src={status.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${status.full_name}`} className="w-12 h-12 rounded-full" alt="avatar" />
              <div>
                <div className="text-white font-bold">{status.full_name}</div>
                <div className="text-muted text-sm">@{status.username}</div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="text-xs text-muted uppercase tracking-wider mb-1">Reason</div>
              <div className="text-red-400 font-medium">
                {status.suspended_reason || "Violating community guidelines."}
              </div>
            </div>
          </div>

          <div className="w-full bg-surface border border-border rounded-2xl p-6 text-left mb-8">
            <h2 className="text-white font-bold text-lg mb-4">How to submit an appeal</h2>
            <ol className="list-decimal list-inside text-muted space-y-3 text-sm">
              <li>Open the <strong>LU Connect app</strong> on your phone.</li>
              <li>Log in with your account details.</li>
              <li>The app will automatically take you to the <strong>Appeal Screen</strong>.</li>
              <li>Follow the on-screen steps to take a live selfie for verification.</li>
              <li>Write your appeal explaining why your account should be unbanned.</li>
              <li>Submit and wait for our admin team to review it.</li>
            </ol>
          </div>

          <button onClick={handleOpenApp} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:-translate-y-1 block mb-3">
            Open LU Connect App
          </button>
          <Link href="/download" className="text-muted hover:text-white text-sm mb-4 block underline">
            Don't have the app? Download it here
          </Link>
          
          <button 
            onClick={() => { setStep(1); setStatus(null); setIssue(""); supabase.auth.signOut(); }}
            className="text-muted hover:text-white text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // STANDARD LAYOUT FOR OTHER ISSUES
  return (
    <div className="max-w-[500px] mx-auto pt-32 pb-16 px-4 min-h-[80vh] flex flex-col justify-center">
      
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-bold mb-2 text-white">Help & Support</h1>
        <p className="text-muted text-[15px]">We're here to help you get back into your account.</p>
      </div>

      {error && (
        <div className="mb-6 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          <button onClick={() => handleIssueSelect("banned")} className="text-left w-full bg-surface border border-border hover:border-luRed p-4 rounded-xl transition-colors text-white font-medium">
            🚫 I think my account is banned or suspended
          </button>
          <button onClick={() => handleIssueSelect("pending")} className="text-left w-full bg-surface border border-border hover:border-luRed p-4 rounded-xl transition-colors text-white font-medium">
            ⏳ My account is stuck on "Pending Approval"
          </button>
          <button onClick={() => handleIssueSelect("hacked")} className="text-left w-full bg-surface border border-border hover:border-luRed p-4 rounded-xl transition-colors text-white font-medium">
            🔒 My account was hacked
          </button>
          <button onClick={() => handleIssueSelect("reset")} className="text-left w-full bg-surface border border-border hover:border-luRed p-4 rounded-xl transition-colors text-white font-medium">
            🔑 I just need to reset my password
          </button>
        </div>
      )}

      {step === 2 && issue !== "reset" && (
        <form onSubmit={handleVerify} className="bg-surface border border-border rounded-[24px] p-6 shadow-2xl">
          <p className="text-sm text-luGold font-semibold mb-4 text-center">To protect your account, please verify your identity.</p>
          <div className="mb-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full bg-black border border-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-luGold transition-colors mb-3" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-black border border-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-luGold transition-colors" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50 mb-3">
            {loading ? "Verifying..." : "Verify Account"}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-muted text-sm hover:text-white">Back</button>
        </form>
      )}

      {step === 2 && issue === "reset" && (
        <form onSubmit={(e) => { e.preventDefault(); handleReset(); }} className="bg-surface border border-border rounded-[24px] p-6 shadow-2xl">
          <p className="text-sm text-muted mb-4 text-center">Enter your email and we'll send a password reset link.</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full bg-black border border-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-luGold transition-colors mb-4" />
          <button type="submit" disabled={loading} className="w-full bg-luRed hover:bg-[#dc2626] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 mb-3">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-muted text-sm hover:text-white">Back</button>
        </form>
      )}

      {step === 3 && !isBanned && (
        <div className="bg-surface border border-border rounded-[24px] p-6 shadow-2xl text-center">
          {status?.resetSent ? (
            <div>
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-muted text-sm mb-6">We sent a password reset link to {email}.</p>
            </div>
          ) : (
            <div>
              <img src={status.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${status.full_name}`} className="w-16 h-16 rounded-full mx-auto mb-3" alt="avatar" />
              <h2 className="text-lg font-bold text-white mb-1">{status.full_name}</h2>
              
              <div className="mt-6 text-sm text-left bg-black/40 p-4 rounded-xl border border-border">
                {issue === "pending" && status.approval_status === "pending" && (
                  <div className="text-yellow-400"><strong>Pending Approval:</strong> Your account is still in the queue. Admins are reviewing it manually.</div>
                )}
                {issue === "hacked" && (
                  <div className="text-muted"><strong>Security Check:</strong> Since you know your password, we recommend changing it immediately and logging out of all devices.</div>
                )}
              </div>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3">
             <button onClick={() => { setStep(1); setEmail(""); setPassword(""); setIssue(""); setStatus(null); }} className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-semibold py-3 rounded-xl transition-all">Back to Home</button>
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/guides" className="text-muted hover:text-white text-sm transition-colors">Watch video guides instead</Link>
      </div>
    </div>
  );
}
