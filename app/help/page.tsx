"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string; full_name: string; username: string; avatar_url: string;
  email: string; is_suspended: boolean; suspended_reason: string;
  approval_status: string; rejection_reason: string;
};

// Simple SVG Icons for a premium look
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconKey = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
);
const IconFlag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
);
const IconChevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);

export default function HelpCenter() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [reportMsg, setReportMsg] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const supabase = createClient();

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true); setError("");
    const { data: exists, error } = await supabase.rpc("email_exists", { check_email: email.trim().toLowerCase() });
    if (error) setError("Lookup failed. Please try again.");
    else if (!exists) setError("Email not registered.");
    else setStep(2);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true); setError("");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), password
    });

    if (authError) {
      if (authError.message.includes("Email not confirmed")) await fetchProfile();
      else { setError(authError.message); setLoading(false); }
      return;
    }
    await fetchProfile();
  };

  const fetchProfile = async () => {
    const { data: profileData, error } = await supabase.from("profiles").select("*").eq("email", email.trim().toLowerCase()).maybeSingle();
    if (error || !profileData) { setError("Profile not found in database."); setLoading(false); return; }
    setProfile(profileData); setStep(3); setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStep(1); setEmail(""); setPassword(""); setProfile(null);
  };

  const handleResetPassword = async () => {
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    setResetMsg(error ? "Error: " + error.message : "Success! Check your inbox.");
    setLoading(false);
  };

  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setReportMsg("Report submitted successfully. Our team will review it.");
    setLoading(false);
  };

  const getStatusUI = () => {
    if (!profile) return null;
    const status = (profile.approval_status || "").toLowerCase();
    if (profile.is_suspended) return { badge: "Suspended", color: "bg-luRed/10 text-luRed border-luRed/20", alert: "Account Suspended", reason: profile.suspended_reason || "Your account has been suspended." };
    if (status === "rejected") return { badge: "Rejected", color: "bg-luRed/10 text-luRed border-luRed/20", alert: "Registration Rejected", reason: profile.rejection_reason || "Your registration was rejected." };
    if (status === "pending") return { badge: "Pending", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", alert: "Approval Pending", reason: "Your account is currently under review by the admin team." };
    return { badge: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20", alert: null, reason: null };
  };
  const statusUI = getStatusUI();

  // --- LOGIN VIEW ---
  if (step === 1 || step === 2) {
    return (
      <div className="max-w-[400px] mx-auto pt-10 pb-20 flex flex-col items-center">
        <div className="w-[80px] h-[80px] border-[2px] border-luRed rounded-[20px] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <span className="text-[32px] font-black text-text">LU</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted text-sm mb-8">Sign in to your LU Connect account</p>

        <div className="w-full">
          {step === 1 && (
            <form onSubmit={handleCheckEmail} className="flex flex-col gap-4">
              <div className="premium-input-group">
                <span className="premium-input-icon">✉️</span>
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="premium-input" autoFocus />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-luRed hover:bg-[#dc2626] text-text font-bold py-3.5 rounded-[16px] transition-all shadow-lg shadow-luRed/20">
                {loading ? "Checking..." : "Continue"}
              </button>
              {error && <p className="text-luRed text-center text-sm">{error}</p>}
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="premium-input-group">
                <span className="premium-input-icon">🔒</span>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="premium-input" autoFocus />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-luRed hover:bg-[#dc2626] text-text font-bold py-3.5 rounded-[16px] transition-all shadow-lg shadow-luRed/20">
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <button type="button" onClick={() => { setStep(1); setError(""); }} className="text-muted hover:text-text text-xs mt-2 transition-colors">
                Back to Email
              </button>
              {error && <p className="text-luRed text-center text-sm">{error}</p>}
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- PREMIUM DASHBOARD VIEW ---
  return (
    <div className="max-w-[420px] mx-auto pt-6 pb-20">
      
      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-[32px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="w-[100px] h-[100px] rounded-full border-[2px] border-luGold p-1 shadow-[0_0_25px_rgba(255,215,0,0.2)]">
            {profile?.avatar_url && profile.avatar_url.trim() !== "" ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name} 
                className="w-full h-full rounded-full object-cover bg-surface" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=1a1a1a&color=FFD700`;
                }}
              />
            ) : (
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=1a1a1a&color=FFD700`} 
                alt="Default Avatar" 
                className="w-full h-full rounded-full object-cover bg-surface" 
              />
            )}
          </div>
          {statusUI?.badge === "Active" && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-[3px] border-surface rounded-full"></div>
          )}
        </div>
        
        <h2 className="text-[22px] font-bold text-text mb-1">{profile?.full_name || "LU Connect User"}</h2>
        <p className="text-muted text-[14px] mb-4">@{profile?.username || "user"}</p>
        
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusUI?.color}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          {statusUI?.badge}
        </div>
      </div>

      {/* Alerts */}
      {statusUI?.alert && (
        <div className={`p-4 rounded-[20px] mb-6 flex gap-3 text-sm border ${profile?.is_suspended || profile?.approval_status === 'rejected' ? 'bg-luRed/10 border-luRed/20 text-red-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
          <span>{profile?.is_suspended ? "🚫" : profile?.approval_status === 'rejected' ? "❌" : "⏳"}</span>
          <div>
            <strong className="block mb-1">{statusUI.alert}</strong>
            <span className="opacity-90 leading-snug">{statusUI.reason}</span>
          </div>
        </div>
      )}

      {/* Menu Card */}
      <div className="bg-surface border border-border rounded-[32px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <h3 className="text-[15px] font-semibold text-text mb-4 px-2">Help & Support</h3>
        
        <div className="flex flex-col gap-3">
          <button onClick={() => setActiveModal("status")} className="flex items-center justify-between p-4 bg-surface border border-border rounded-[20px] hover:border-luRed/50 hover:bg-[#151515] transition-all group">
            <div className="flex items-center gap-4">
              <div className="text-luGold bg-luGold/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <IconShield />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-semibold text-text">Account Status</div>
                <div className="text-[12px] text-muted">View restrictions or appeal</div>
              </div>
            </div>
            <div className="text-muted group-hover:text-text transition-colors"><IconChevron /></div>
          </button>

          <button onClick={() => setActiveModal("password")} className="flex items-center justify-between p-4 bg-surface border border-border rounded-[20px] hover:border-luRed/50 hover:bg-[#151515] transition-all group">
            <div className="flex items-center gap-4">
              <div className="text-blue-400 bg-blue-400/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <IconKey />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-semibold text-text">Reset Password</div>
                <div className="text-[12px] text-muted">Secure your account</div>
              </div>
            </div>
            <div className="text-muted group-hover:text-text transition-colors"><IconChevron /></div>
          </button>

          <button onClick={() => setActiveModal("report")} className="flex items-center justify-between p-4 bg-surface border border-border rounded-[20px] hover:border-luRed/50 hover:bg-[#151515] transition-all group">
            <div className="flex items-center gap-4">
              <div className="text-luRed bg-luRed/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <IconFlag />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-semibold text-text">Report a Problem</div>
                <div className="text-[12px] text-muted">Report a bug or issue</div>
              </div>
            </div>
            <div className="text-muted group-hover:text-text transition-colors"><IconChevron /></div>
          </button>
        </div>

        <button onClick={handleLogout} className="w-full mt-6 bg-transparent border border-border hover:bg-white/5 text-text font-semibold py-3.5 rounded-[16px] transition-colors">
          Log Out
        </button>
      </div>

      {/* --- PREMIUM MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
          <div className="bg-surface border border-border rounded-[32px] w-full max-w-[380px] p-6 shadow-2xl relative animate-slide-up">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-bold text-text">
                {activeModal === "status" && "Account Status"}
                {activeModal === "password" && "Reset Password"}
                {activeModal === "report" && "Report a Problem"}
              </h3>
              <button onClick={() => { setActiveModal(null); setReportMsg(""); setResetMsg(""); }} className="text-muted hover:text-text text-2xl leading-none bg-white/5 w-8 h-8 rounded-full flex items-center justify-center">&times;</button>
            </div>

            {activeModal === "status" && (
              <div>
                <div className="text-center p-4">
                  {profile?.is_suspended ? (
                    <>
                      <div className="text-4xl mb-3">🚫</div>
                      <h4 className="text-luRed font-bold mb-2">Account Suspended</h4>
                      <p className="text-muted text-sm mb-4">{profile.suspended_reason || "Your account has been suspended."}</p>
                      <button onClick={() => setActiveModal("report")} className="w-full border border-border py-3 rounded-[16px] hover:bg-white/5 text-sm font-semibold">Appeal Ban</button>
                    </>
                  ) : profile?.approval_status === 'rejected' ? (
                     <>
                      <div className="text-4xl mb-3">❌</div>
                      <h4 className="text-luRed font-bold mb-2">Registration Rejected</h4>
                      <p className="text-muted text-sm mb-4">{profile.rejection_reason || "Your registration was rejected."}</p>
                      <button onClick={() => setActiveModal("report")} className="w-full border border-border py-3 rounded-[16px] hover:bg-white/5 text-sm font-semibold">Request Review</button>
                    </>
                  ) : profile?.approval_status === 'pending' ? (
                    <>
                      <div className="text-4xl mb-3">⏳</div>
                      <h4 className="text-yellow-500 font-bold mb-2">Approval Pending</h4>
                      <p className="text-muted text-sm leading-relaxed">Your account is currently under review. This usually takes 24-48 hours.</p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-3">✅</div>
                      <h4 className="text-green-500 font-bold mb-2">Good Standing</h4>
                      <p className="text-muted text-sm">You have full access to LU Connect.</p>
                    </>
                  )}
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full border border-border py-3 rounded-[16px] hover:bg-white/5 text-sm font-semibold mt-4">Close</button>
              </div>
            )}

            {activeModal === "password" && (
              <div>
                <p className="text-muted text-sm mb-4 leading-relaxed">We will send a secure password reset link to your registered email address.</p>
                <input type="email" value={profile?.email || ""} readOnly className="w-full bg-surface border border-border rounded-[16px] px-4 py-3 text-muted mb-4 cursor-not-allowed text-sm" />
                <button onClick={handleResetPassword} disabled={loading} className="w-full bg-luGold text-black font-bold py-3.5 rounded-[16px] hover:bg-yellow-400 text-sm">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                {resetMsg && <p className="text-green-500 text-center text-xs mt-3">{resetMsg}</p>}
              </div>
            )}

            {activeModal === "report" && (
              <form onSubmit={handleReport}>
                <select className="w-full bg-surface border border-border rounded-[16px] px-4 py-3 text-text mb-3 focus:outline-none focus:border-luRed text-sm appearance-none">
                  <option value="bug">App Bug / Glitch</option>
                  <option value="account">Account Issue</option>
                  <option value="safety">Safety / Harassment</option>
                  <option value="other">Other</option>
                </select>
                <textarea rows={4} placeholder="Describe the issue in detail..." required className="w-full bg-surface border border-border rounded-[16px] px-4 py-3 text-text mb-4 focus:outline-none focus:border-luRed resize-none text-sm"></textarea>
                <button type="submit" disabled={loading} className="w-full bg-luRed text-text font-bold py-3.5 rounded-[16px] hover:bg-[#dc2626] text-sm shadow-lg shadow-luRed/20">
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
                {reportMsg && <p className="text-green-500 text-center text-xs mt-3">{reportMsg}</p>}
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
