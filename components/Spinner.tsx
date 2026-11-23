"use client";
import { useState, useEffect } from "react";

export default function Spinner() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // 1000ms delay so the user sees the animation
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => setShow(false), 600); // Wait for fade out transition
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 bg-black flex flex-col justify-center items-center z-[9999] transition-opacity duration-600 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      
      <div className="premium-spinner-container mb-6">
        <div className="premium-spinner-glow"></div>
        <div className="premium-spinner-ring-1"></div>
        <div className="premium-spinner-ring-2"></div>
        <div className="premium-spinner-core">LU</div>
      </div>

      <div className={`text-luRed text-sm font-bold tracking-[0.3em] transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100 animate-pulse'}`}>
        CONNECTING
      </div>

    </div>
  );
}
