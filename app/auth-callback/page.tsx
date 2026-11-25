"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const [status, setStatus] = useState("Securing your session...");
  const supabase = createClient();

  useEffect(() => {
    // 1. Check if the website got the session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("Success! Opening the app...");
        
        // 2. Pass the tokens to the app so it logs in automatically
        const accessToken = session.access_token;
        const refreshToken = session.refresh_token;
        
        const appUrl = `luconnectnative://auth-callback#access_token=${accessToken}&refresh_token=${refreshToken}`;
        
        // 3. Redirect to the app after 1.5 seconds
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
      
      {/* Fallback button if the auto-redirect fails */}
      <a 
        href={`luconnectnative://auth-callback`} 
        className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold"
      >
        Open App Manually
      </a>
    </div>
  );
}
