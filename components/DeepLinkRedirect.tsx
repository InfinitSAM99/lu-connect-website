"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DeepLinkRedirect({ path }: { path: string }) {
  const [countdown, setCountdown] = useState(3);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Try to open the app immediately
    window.location.href = `luconnectnative://${path}`;

    // If the app doesn't open in 2 seconds, show the fallback
    const timer = setTimeout(() => setFailed(true), 2500);
    return () => clearTimeout(timer);
  }, [path]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 border-[3px] border-luRed rounded-[20px] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
        <span className="text-[32px] font-black text-text">LU</span>
      </div>

      {!failed ? (
        <>
          <h1 className="text-2xl font-bold text-text mb-2">Opening in App...</h1>
          <p className="text-muted">Please wait while we redirect you to LU Connect.</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-text mb-2">App Not Installed</h1>
          <p className="text-muted mb-8 max-w-sm">It looks like you don't have LU Connect installed. Download it to view this content.</p>
          <Link href="/download" className="bg-luRed text-white font-bold py-3.5 px-8 rounded-[16px] hover:bg-[#dc2626] transition-all shadow-lg shadow-luRed/20">
            Download App
          </Link>
          <Link href="/" className="mt-4 text-sm text-muted hover:text-text transition-colors">
            Go to Homepage
          </Link>
        </>
      )}
    </div>
  );
}
