"use client";

import { useState, useEffect, useCallback } from "react";
import { GITHUB_REPO, FALLBACK_APK_URL } from "@/lib/constants";

export default function Download() {
  const [release, setRelease] = useState({
    tag: "Fetching latest release...",
    url: FALLBACK_APK_URL,
    size: "133 MB",
    name: "LU-Connect.apk"
  });

  const fetchLatest = useCallback(async () => {
    try {
      setRelease(prev => ({ ...prev, tag: "Checking for updates..." }));
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest?t=${Date.now()}`);
      if (!res.ok) throw new Error("API limit");
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
  }, []);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  return (
    <div className="max-w-[500px] mx-auto py-10 text-center px-4">
      <div className="mb-10">
        <h1 className="text-[42px] font-black mb-2">Get the App</h1>
        <p className="text-muted text-[18px]">Download the latest version of LU Connect for Android.</p>
      </div>

      <div className="bg-surface border border-border rounded-[24px] p-[40px_30px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="inline-block bg-luGold/10 text-luGold border border-luGold/30 px-4 py-2 rounded-full font-bold text-sm mb-5">
          {release.tag}
        </div>
        <h2 className="text-white text-[24px] mb-1 font-bold">LU Connect Native</h2>
        <p className="text-muted text-sm mb-5">Experience your campus, connected.</p>

        <a href={release.url} className="flex items-center justify-center gap-2 w-full bg-luRed hover:bg-[#dc2626] text-white py-[18px] rounded-[16px] text-[18px] font-bold transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(239,68,68,0.4)]">
          ⬇ Download APK
        </a>
        <div className="mt-[15px] text-[13px] text-muted">
          {release.size} • {release.name}
        </div>
      </div>

      {/* REAL YOUTUBE THUMBNAIL CARD */}
      <div className="mt-6 bg-[#181818] border border-[#2a2a2a] rounded-[20px] overflow-hidden text-left shadow-lg">
        <a 
          href="https://youtu.be/i_MrSAbc2D8?si=3c2t8VIw4tbYaWSP" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative group"
        >
          {/* The Thumbnail Image */}
          <img 
            src="https://img.youtube.com/vi/i_MrSAbc2D8/maxresdefault.jpg" 
            alt="How to install LU Connect"
            className="w-full h-[200px] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          
          {/* The Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform duration-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" className="ml-1">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* Video Duration Badge (Fake for attraction) */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[12px] font-bold px-2 py-1 rounded">
            1:45
          </div>
        </a>
        
        <div className="p-4">
          <h3 className="text-white font-bold text-[16px] leading-tight">
            How to Download & Install LU Connect on Android
          </h3>
          <p className="text-[#a1a1aa] text-[13px] mt-1">
            Having trouble installing? Watch this quick guide.
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[20px] p-[30px] mt-6 text-left">
        <h3 className="text-luGold mb-4 font-bold">How to Install</h3>
        <ol className="list-decimal list-inside text-muted leading-[1.8] space-y-2 text-[15px]">
          <li>Tap the <strong>Download</strong> button above.</li>
          <li>Open the downloaded APK file on your phone.</li>
          <li>If prompted, allow "Install from Unknown Sources" in settings.</li>
          <li>Tap <strong>Install</strong> and open LU Connect.</li>
          <li>Log in with your university email.</li>
        </ol>
      </div>
    </div>
  );
}
