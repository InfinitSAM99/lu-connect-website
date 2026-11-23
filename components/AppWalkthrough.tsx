"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const screens = [
  {
    id: "chats",
    title: "Chats",
    icon: "💬",
    content: (
      <div className="flex flex-col gap-2 w-full px-2">
        {[
          { name: "Campus Council", msg: "Meeting at 4 PM!", color: "bg-blue-500" },
          { name: "Sarah K.", msg: "Did you see the new story?", color: "bg-purple-500" },
          { name: "CS Group", msg: "Hackathon this weekend!", color: "bg-green-500" },
          { name: "Brian M.", msg: "Check the new update", color: "bg-yellow-500" }
        ].map((chat, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#111] p-2.5 rounded-xl border border-[#222]">
            <div className={`w-8 h-8 rounded-full ${chat.color} flex items-center justify-center text-xs font-bold text-white`}>{chat.name[0]}</div>
            <div className="flex-1 overflow-hidden">
              <div className="text-[11px] font-bold text-white truncate">{chat.name}</div>
              <div className="text-[9px] text-muted truncate">{chat.msg}</div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "stories",
    title: "Stories",
    icon: "✨",
    content: (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-full aspect-[9/16] bg-gradient-to-br from-luRed/40 to-purple-600/40 rounded-2xl border-2 border-luRed relative overflow-hidden flex flex-col justify-end p-4">
           <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white"></div>
              <div className="text-[10px] font-bold text-white">Sarah K.</div>
           </div>
           <div className="text-xs font-bold text-white mb-1">Campus Life 📚</div>
           <div className="h-1 w-full bg-white/30 rounded-full"><div className="h-full w-2/3 bg-white rounded-full"></div></div>
        </div>
      </div>
    )
  },
  {
    id: "profile",
    title: "Profile",
    icon: "👤",
    content: (
      <div className="w-full flex flex-col items-center pt-6 px-4">
        <div className="w-16 h-16 rounded-full border-2 border-luGold p-0.5 mb-2">
          <div className="w-full h-full rounded-full bg-[#222] flex items-center justify-center text-xl font-bold text-luGold">JW</div>
        </div>
        <div className="text-sm font-bold text-white">Juice Wrld</div>
        <div className="text-[10px] text-muted mb-4">@Wrld</div>
        <div className="flex gap-4 w-full justify-center">
           <div className="text-center"><div className="text-sm font-bold text-white">124</div><div className="text-[9px] text-muted">Posts</div></div>
           <div className="text-center"><div className="text-sm font-bold text-white">1.2K</div><div className="text-[9px] text-muted">Friends</div></div>
        </div>
        <div className="grid grid-cols-3 gap-1 w-full mt-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-[#1a1a1a] rounded-sm"></div>)}
        </div>
      </div>
    )
  }
];

export default function AppWalkthrough() {
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    // Cycle through screens every 3 seconds
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
      {/* App Header */}
      <div className="w-full pt-10 pb-3 px-4 bg-[#111] border-b border-[#222] flex items-center justify-between z-10">
        <div className="w-7 h-7 rounded bg-luRed flex items-center justify-center font-black text-[10px] text-white">LU</div>
        <div className="text-[11px] font-bold text-white">{screens[currentScreen].title}</div>
        <div className="text-sm text-white">✏️</div>
      </div>

      {/* Main App Content */}
      <div className="flex-1 w-full relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {screens[currentScreen].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* App Bottom Nav */}
      <div className="w-full bg-[#111] border-t border-[#222] py-3 flex justify-around items-center z-10">
        {screens.map((screen, i) => (
          <div key={screen.id} className={`text-lg transition-colors ${i === currentScreen ? "text-luRed scale-110" : "text-muted"}`}>
            {screen.icon}
          </div>
        ))}
      </div>
    </div>
  );
}
