"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function WebLogin() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // This tells Supabase to redirect to our bridge page after login
        redirectTo: `${window.location.origin}/auth-callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <div className="w-20 h-20 border-4 border-red-500 rounded-3xl flex items-center justify-center mb-6">
        <span className="text-4xl font-black">LU</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">LU CONNECT</h1>
      <p className="text-gray-400 mb-8">Log in to continue to the app</p>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting..." : "Continue with Google"}
      </button>
    </div>
  );
}
