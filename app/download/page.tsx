"use client";
import { useState, useEffect } from "react";
import { GITHUB_REPO, FALLBACK_APK_URL } from "@/lib/constants";

export default function Download() {
  const [release, setRelease] = useState({ tag: "Fetching latest release...", url: FALLBACK_APK_URL, size: "133 MB", name: "LU-Connect.apk" });

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        if (!res.ok) throw new Error("API limit");
        const data = await res.json();
        const apk = data.assets.find((a: any) => a.name.endsWith(".apk"));
        if (apk) setRelease({ tag: `Latest: ${data.tag_name}`, url: apk.browser_download_url, size: `${(apk.size / (1024 * 1024)).toFixed(1)} MB`, name: apk.name });
      } catch (err) {
        setRelease((prev) => ({ ...prev, tag: "Latest Release (Build 16)" }));
      }
    }
    fetchLatest();
  }, []);

  return (
    <div className="max-w-[500px] mx-auto py-10 text-center">
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

      <div className="bg-surface border border-border rounded-[20px] p-[30px] mt-[30px] text-left">
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
