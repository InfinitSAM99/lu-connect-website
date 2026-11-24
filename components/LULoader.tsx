"use client";
import React from "react";

interface LULoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export default function LULoader({ size = 120, text, className = "" }: LULoaderProps) {
  // Refined coordinates and colors
  const bars = [
    { id: 1, x: 30, y: 10, w: 16, h: 50, rot: 45, color: "#FFFFFF", type: "white" }, // Top Left
    { id: 2, x: 45, y: 25, w: 16, h: 45, rot: 45, color: "#333333", type: "dark" },  // Top Mid
    { id: 3, x: 55, y: 15, w: 16, h: 55, rot: 45, color: "#FF0000", type: "red" },   // Top Right
    { id: 4, x: 70, y: 30, w: 16, h: 45, rot: 45, color: "#4D0000", type: "dark" },  // Right Mid
    { id: 5, x: 60, y: 55, w: 16, h: 50, rot: 45, color: "#FFFFFF", type: "white" }, // Bottom Right
    { id: 6, x: 45, y: 70, w: 16, h: 45, rot: 45, color: "#333333", type: "dark" },  // Bottom Mid
    { id: 7, x: 35, y: 60, w: 16, h: 55, rot: 45, color: "#FF0000", type: "red" },   // Bottom Left
    { id: 8, x: 20, y: 45, w: 16, h: 45, rot: 45, color: "#4D0000", type: "dark" },  // Left Mid
  ];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      
      {/* 
        Organic Background Glow 
        This replaces the boxy drop-shadow. It's a soft radial gradient that pulses.
      */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[50px] pointer-events-none animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(255,0,0,0.15) 0%, rgba(255,0,0,0) 70%)",
          // Scale the glow with the spinner size
          transform: `translate(-50%, -50%) scale(${size / 120})`
        }}
      />

      <div 
        className="relative z-10"
        style={{
          // Slow, smooth floating effect
          animation: "float-pulse 4s ease-in-out infinite"
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          <g>
            {bars.map((bar, index) => {
              const centerX = bar.x + bar.w / 2;
              const centerY = bar.y + bar.h / 2;

              return (
                <rect
                  key={bar.id}
                  x={bar.x}
                  y={bar.y}
                  width={bar.w}
                  height={bar.h}
                  rx={bar.w / 2}
                  fill={bar.color}
                  style={{
                    transformOrigin: `${centerX}px ${centerY}px`,
                    transform: `rotate(${bar.rot}deg)`,
                    // Smoother animation without the heavy drop-shadow filter
                    animation: `bar-pulse 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.15}s`,
                  }}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {text && (
        <p className="relative z-10 mt-8 text-[#FF0000] text-xs font-bold tracking-[0.4em] uppercase">
          {text}
        </p>
      )}
    </div>
  );
}
