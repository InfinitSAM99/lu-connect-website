"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Download, Trash2, Loader2 } from "lucide-react";

export default function AccountClient({ user, profile }: { user: any, profile: any }) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/download-data');
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lu-connect-data-${user.id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert("Failed to download data.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you ABSOLUTELY sure? This will permanently delete your profile, posts, messages, and connections.");
    if (!confirm) return;
    setDeleting(true);
    try {
      const response = await fetch('/api/delete-account', { method: 'POST' });
      if (!response.ok) throw new Error("Deletion failed");
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      alert("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 mb-8 flex items-center gap-4">
        <img 
          src={profile?.avatar_url || "/default-avatar.png"} 
          alt="Profile" 
          className="w-16 h-16 rounded-full object-cover border-2 border-[#ef4444]"
        />
        <div>
          <h2 className="text-xl font-bold text-white">{profile?.full_name || "User"}</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <p className="text-yellow-500 text-sm">{profile?.university_name || "No University Set"}</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Download Your Data</h3>
        <p className="text-gray-400 text-sm mb-4">Get a copy of your profile, posts, messages, and connections as a JSON file.</p>
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 w-full bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {downloading ? "Preparing Data..." : "Download My Data"}
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-red-900/30 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-red-500 mb-2">Delete Account</h3>
        <p className="text-gray-400 text-sm mb-4">Permanently remove your account and all associated data. This action is irreversible.</p>
        <button 
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          {deleting ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </>
  );
}
