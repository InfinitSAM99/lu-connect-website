"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Download } from "lucide-react";

export default function ProfileRedirect() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  useEffect(() => {
    if (!userId) return;

    // 1. Try to open the app using the deep link scheme
    const appLink = `luconnectnative://profile/${userId}`;
    
    // We use a timeout to detect if the app didn't open (meaning they don't have it installed)
    const timeout = setTimeout(() => {
      // If the app didn't open after 2 seconds, they likely don't have it installed.
      // We can redirect them to the download page.
      router.push("/download");
    }, 2000);

    // Attempt to launch the app
    window.location.href = appLink;

    // If the page loses focus (app opened), clear the timeout
    const handleBlur = () => clearTimeout(timeout);
    window.addEventListener("blur", handleBlur);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("blur", handleBlur);
    };
  }, [userId, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luGold/10 border border-luGold/30 mb-6 animate-pulse">
          <ShieldCheck className="w-10 h-10 text-luGold" />
        </div>
        <h1 className="text-2xl font-black mb-2">Opening LU Connect...</h1>
        <p className="text-neutral-400 text-sm">Please wait while we redirect you to the app.</p>
        
        <div className="mt-12">
          <p className="text-neutral-500 text-xs mb-3">App not opening?</p>
          <a 
            href="/download" 
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            Download the App
          </a>
        </div>
      </div>
    </div>
  );
}
