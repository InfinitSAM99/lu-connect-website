"use client";
import Link from "next/link";
import Stats from "@/components/Stats";
import SplashAnimation from "@/components/SplashAnimation";
import AppWalkthrough from "@/components/AppWalkthrough";
import { useState } from "react";
import Universities from "@/components/Universities";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="overflow-hidden">
      {/* HERO SPLIT */}
      <div className="flex flex-col md:flex-row items-center justify-between py-[60px] gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-[52px] font-black leading-[1.1] mb-5 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            Your Campus. <br />Connected.
          </h1>
          <p className="text-muted text-base md:text-[18px] leading-[1.6] mb-[30px] max-w-[450px] mx-auto md:mx-0">
            The exclusive social network for Kenyan university students. Chat, share stories, and discover your community like never before.
          </p>
          
          <div className="flex flex-col md:flex-row gap-[15px] justify-center md:justify-start w-full">
            <a href="luconnectnative://" className="bg-luRed text-text py-4 px-10 rounded-[30px] font-bold text-[18px] hover:bg-[#dc2626] hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-[10px]">
              📱 Open in App
            </a>
            <Link href="/download" className="bg-transparent border-2 border-border text-text py-4 px-10 rounded-[30px] font-bold text-[18px] hover:border-white hover:bg-white/5 transition-all flex items-center justify-center">
              Download APK
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-luRed blur-[120px] opacity-30 z-0"></div>
          
          {/* PREMIUM PHONE MOCKUP */}
          <div className="w-[220px] md:w-[280px] h-[440px] md:h-[560px] bg-black border-[6px] md:border-[8px] border-[#333] rounded-[40px] shadow-[0_0_0_2px_#555,0_20px_50px_rgba(239,68,68,0.4)] relative overflow-hidden flex flex-col z-10">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-black rounded-b-[20px] z-20"></div>
            
            {/* 🚀 SPLASH AND APP WALKTHROUGH */}
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center z-10 overflow-hidden">
              {showSplash ? (
                <SplashAnimation onComplete={() => setShowSplash(false)} />
              ) : (
                <AppWalkthrough />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STATS & MARQUEE */}
      <div className="bg-surface border-y border-border py-6 my-10 overflow-hidden relative">
        <Stats />
        
        {/* University Marquee */}
        <div className="mt-8 flex whitespace-nowrap animate-marquee">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-10 px-5">
              {["Laikipia University", "University of Nairobi", "Kenyatta University", "JKUAT", "Moi University", "Egerton University", "Maseno University"].map((uni, j) => (
                <span key={j} className="text-muted/50 font-bold text-lg md:text-xl uppercase tracking-wider flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-luRed/50"></span> {uni}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT THE APP */}
      <div className="mt-[60px]">
        <h2 className="text-luGold text-[32px] font-bold mb-5 text-center">What is LU Connect?</h2>
        <p className="text-muted text-center max-w-[700px] mx-auto mb-[40px] leading-[1.8] text-[16px]">
          LU Connect is more than just a social network. It is a digital campus built exclusively for Kenyan students. We are bridging the gap between universities, creating a space where students can connect, collaborate, and build their future.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: "🔥", title: "Realtime Chat", desc: "Lightning fast messaging with friends and groups. Custom themes, voice notes, and disappearing messages included." },
            { icon: "✨", title: "24H Stories", desc: "Share moments that disappear. See what's happening on campus right now." },
            { icon: "🎓", title: "Verified Students", desc: "An exclusive space. Only verified students from your university can join." },
            { icon: "💎", title: "LU Pro", desc: "Upgrade to unlock exclusive chat themes, custom icons, and a glowing gold profile ring." }
          ].map((f, i) => (
            <div key={i} className="bg-surface border border-border rounded-[20px] p-[30px] transition-all hover:border-luRed/50 hover:-translate-y-1">
              <h3 className="text-luGold mb-4 text-2xl font-bold">{f.icon} {f.title}</h3>
              <p className="text-muted leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BIG CTA BANNER */}
      <div className="mt-20 bg-gradient-to-r from-luRed/20 via-black to-luRed/20 border border-border rounded-[30px] p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-luRed/5 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-text mb-4">Ready to join your campus?</h2>
          <p className="text-muted mb-8 text-lg">Download LU Connect and start connecting with thousands of students today.</p>
          <Link href="/download" className="inline-flex bg-luGold text-black font-bold py-4 px-10 rounded-[30px] text-lg hover:bg-yellow-400 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,215,0,0.4)] transition-all">
            Get the App Now
          </Link>
        </div>
      </div>

      {/* PREMIUM FOUNDER CARD */}
      <div className="flex flex-col md:flex-row bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-border rounded-[24px] mt-[60px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex-1 min-w-[300px] relative h-[400px] md:h-auto">
          <img 
            src="/samuel.jpg" 
            alt="Samuel Mugasia" 
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent z-10"></div>
        </div>
        
        <div className="flex-[1.5] p-[30px] md:p-[40px] flex flex-col justify-center relative z-20">
          <h2 className="text-[36px] text-text mb-[5px] font-bold">Samuel Mugasia</h2>
          <p className="text-luGold text-[18px] font-bold mb-[5px]">Founder & CEO</p>
          <p className="text-muted text-base italic mb-[30px]">"JuiceWRLD"</p>

          <div className="grid gap-[15px] mb-[30px]">
            <div className="flex justify-between border-b border-border pb-[10px]">
              <span className="text-muted font-semibold">Born:</span>
              <span className="text-text font-medium">2008</span>
            </div>
            <div className="flex justify-between border-b border-border pb-[10px]">
              <span className="text-muted font-semibold">University:</span>
              <span className="text-text font-medium">Laikipia University</span>
            </div>
            <div className="flex justify-between border-b border-border pb-[10px]">
              <span className="text-muted font-semibold">High School:</span>
              <span className="text-text font-medium">Musingu High School</span>
            </div>
          </div>

          <p className="text-gray-400 text-[16px] leading-[1.6] italic border-l-[3px] border-luRed pl-[15px]">
            "I founded LU Connect to give every Kenyan student a digital home. A place where you are not just a user, but a verified member of your campus community."
          </p>
        </div>
      </div>

      {/* ASSISTANT CEO CARD */}
      <div className="flex items-center gap-5 bg-surface border border-border rounded-[16px] p-[20px] mt-[20px]">
        <div className="w-[60px] h-[60px] rounded-full bg-luRed flex items-center justify-center font-bold text-xl text-text">MA</div>
        <div>
          <h3 className="text-text text-xl mb-[2px] font-bold">Michael Amwalitsa</h3>
          <p className="text-luGold text-sm font-bold mb-[5px]">Assistant CEO</p>
          <span className="text-muted text-sm">Driving the operational excellence behind LU Connect.</span>
        </div>
      </div>

      {/* UNIVERSITIES SECTION */}
      <Universities />

    </div>
  );
}
