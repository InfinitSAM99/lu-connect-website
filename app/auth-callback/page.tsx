"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const [status, setStatus] = useState("Securing your session...");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("Success! Opening app...");
        const accessToken = session.access_token;
        const refreshToken = session.refresh_token;
        
        // DEFAULT TO NATIVE APP
        const appUrl = `luconnectnative://auth-callback#access_token=${accessToken}&refresh_token=${refreshToken}`;

        setTimeout(() => {
          window.location.href = appUrl;
        }, 1500);
      } else {
        setStatus("Login failed. Please try again.");
      }
    });
  }, [supabase]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-2xl font-bold mb-2">{status}</h1>
      <p className="text-gray-400 mb-8">Please wait...</p>

      <a
        href={`luconnectnative://auth-callback`}
        className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold"
      >
        Open App Manually
      </a>
    </div>
  );
}
