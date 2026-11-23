"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SplashAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Tell parent to start the app walkthrough after 5.5 seconds
    const timer = setTimeout(onComplete, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div 
        className="absolute w-[120px] h-[120px] bg-luRed blur-[40px] rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3.8 }}
      />

      <svg viewBox="0 0 200 200" className="w-[140px] h-[140px] z-10 relative mt-[-20px]">
        <motion.rect x="14" y="14" width="172" height="172" rx="34" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ strokeDashoffset: 800 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.8, ease: "easeInOut" }} style={{ strokeDasharray: 800 }} />
        <motion.path d="M 62 60 L 62 130 L 96 130" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" initial={{ strokeDashoffset: 400 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.1, delay: 1.5, ease: "easeInOut" }} style={{ strokeDasharray: 400 }} />
        <motion.path d="M 112 60 L 112 112 A 18 18 0 0 0 148 112 L 148 60" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" initial={{ strokeDashoffset: 400 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.3, delay: 2.4, ease: "easeInOut" }} style={{ strokeDasharray: 400 }} />
        <motion.rect x="14" y="14" width="172" height="172" rx="34" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0] }} transition={{ duration: 2.4, delay: 3.8, repeat: Infinity, ease: "easeInOut" }} />
      </svg>

      <motion.div className="mt-2 text-[10px] text-[#6d7382] tracking-widest text-center z-10" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 3.8 }}>
        by Samuel Mugasia
      </motion.div>
    </div>
  );
}
