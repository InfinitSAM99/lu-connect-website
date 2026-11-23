"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Download, Lock, AlertCircle, KeyRound } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// These pull from your .env.local automatically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// We hardcode the admin repo here, while using the student repo from constants elsewhere
const ADMIN_GITHUB_REPO = "InfinitSAM99/lu-connect-admin-";

export default function AdminDownload() {
  const [code, setCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [release, setRelease] = useState({
    tag: "Fetching latest admin release...",
    url: "#",
    size: "Calculating...",
    name: "LU-Connect-Admin.apk"
  });

  // Fetch the latest release from the Admin Repo
  useEffect(() => {
    if (!isAuthorized) return;
    
    async function fetchLatest() {
      try {
        const res = await fetch(`https://api.github.com/repos/${ADMIN_GITHUB_REPO}/releases/latest`);
        if (!res.ok) throw new Error("API limit or no release");
        const data = await res.json();
        const apk = data.assets.find((a: any) => a.name.endsWith(".apk"));
        
        if (apk) {
          setRelease({
            tag: `Latest: ${data.tag_name}`,
            url: apk.browser_download_url,
            size: `${(apk.size / (1024 * 1024)).toFixed(1)} MB`,
            name: apk.name
          });
        }
      } catch (err) {
        setRelease((prev) => ({ ...prev, tag: "Latest Release (Fallback)" }));
      }
    }
    fetchLatest();
  }, [isAuthorized]);

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      // 1. Check if code exists and is not used
      const { data, error: fetchErr } = await supabase
        .from("admin_download_codes")
        .select("*")
        .eq("code", code.trim())
        .single();

      if (fetchErr || !data) {
        throw new Error("Invalid access code.");
      }

      if (data.is_used) {
        throw new Error("This code has already been used.");
      }

      // 2. Mark code as used
      const { error: updateErr } = await supabase
        .from("admin_download_codes")
        .update({ is_used: true })
        .eq("code", code.trim());

      if (updateErr) throw new Error("Failed to validate code. Try again.");

      // 3. Grant access
      setIsAuthorized(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-luGold/30">
      
      <div className="w-full max-w-[500px]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luGold/10 border border-luGold/30 mb-6">
            <ShieldCheck className="w-10 h-10 text-luGold" />
          </div>
          <h1 className="text-[32px] font-black tracking-tight mb-2">Admin Portal</h1>
          <p className="text-neutral-400 text-sm">Restricted access. Enter your unique clearance code to download the latest admin build.</p>
        </div>

        {/* Content Box */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {!isAuthorized ? (
            <form onSubmit={verifyCode} className="flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CLEARANCE CODE"
                  className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-luGold/50 focus:ring-1 focus:ring-luGold/50 transition-all font-mono tracking-widest"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-luRed bg-luRed/10 p-3 rounded-lg text-sm border border-luRed/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-luGold text-black py-4 rounded-xl font-bold text-[16px] transition-all hover:bg-[#e6c200] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Verifying..." : "Unlock Download"}
                {!loading && <Lock className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="bg-luGold/10 text-luGold border border-luGold/30 px-4 py-2 rounded-full font-bold text-xs mb-6 uppercase tracking-wider">
                {release.tag}
              </div>
              
              <h2 className="text-white text-[22px] mb-1 font-bold">LU Connect Admin</h2>
              <p className="text-neutral-400 text-sm mb-8">Authorized Personnel Only</p>

              <a 
                href={release.url} 
                className="flex items-center justify-center gap-2 w-full bg-luRed hover:bg-[#dc2626] text-white py-4 rounded-xl text-[18px] font-bold transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(239,68,68,0.4)]"
              >
                <Download className="w-5 h-5" />
                Download Admin APK
              </a>
              <div className="mt-4 text-[13px] text-neutral-500 font-mono">
                {release.size} • {release.name}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
