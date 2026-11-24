"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AppealPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [existingAppeal, setExistingAppeal] = useState<any>(null);
  const [appealText, setAppealText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      // 1. Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/help"); // Not logged in? Send to help
        return;
      }

      // 2. Fetch their profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("approval_status, full_name, is_suspended, suspended_reason")
        .eq("id", user.id)
        .single();

      // 3. If they aren't banned/rejected, send them home
      if (profileData?.approval_status !== "banned" && profileData?.approval_status !== "rejected") {
        router.push("/");
        return;
      }
      
      setProfile(profileData);

      // 4. Fetch existing appeal
      const { data: appealData } = await supabase
        .from("ban_appeals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (appealData) {
        setExistingAppeal(appealData);
        setAppealText(appealData.appeal_text || "");
      }

      setLoading(false);
    }
    loadData();
  }, [supabase, router]);

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appealText.trim().length < 20) {
      setError("Please write at least 20 characters explaining your situation.");
      return;
    }

    setSubmitting(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error: dbError } = await supabase.from("ban_appeals").upsert({
      user_id: user?.id,
      appeal_text: appealText,
      stage: "appeal_open", // Set the stage
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    if (dbError) {
      setError(dbError.message);
    } else {
      // Update profile to show they are now in the appeal process
      await supabase.from("profiles").update({ approval_status: "pending" }).eq("id", user?.id);
      router.push("/pending");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="pt-32 text-center text-white">Loading status...</div>;

  return (
    <div className="max-w-[500px] mx-auto pt-32 pb-16 px-4 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <span className="text-4xl">🚫</span>
        </div>
        <h1 className="text-[28px] font-bold mb-2 text-white">Account Suspended</h1>
        <p className="text-muted text-[15px]">
          {profile?.suspended_reason || "Your account has been banned for violating community guidelines."}
        </p>
      </div>

      {existingAppeal && existingAppeal.status === "pending" ? (
        <div className="bg-surface border border-border rounded-[24px] p-6 shadow-2xl text-center">
          <div className="text-yellow-400 text-lg font-bold mb-2">Appeal Under Review</div>
          <p className="text-muted text-sm">
            You have already submitted an appeal. Our team is reviewing it. Please wait for an admin to respond.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitAppeal} className="bg-surface border border-border rounded-[24px] p-6 shadow-2xl">
          <label className="block text-luGold font-bold mb-2">Write your appeal</label>
          <p className="text-muted text-xs mb-4">Explain why your account should be unbanned. Be honest and detailed.</p>
          
          <textarea
            value={appealText}
            onChange={(e) => setAppealText(e.target.value)}
            placeholder="I believe my account was banned by mistake because..."
            rows={5}
            className="w-full bg-black border border-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-luGold transition-colors mb-4 resize-none"
          />

          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

          <button type="submit" disabled={submitting} className="w-full bg-luRed hover:bg-[#dc2626] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Appeal"}
          </button>
        </form>
      )}

      <div className="text-center mt-8">
        <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))} className="text-muted hover:text-white text-sm">
          Sign out
        </button>
      </div>
    </div>
  );
}
