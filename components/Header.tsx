"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/download", label: "Download App" },
    { href: "/guides", label: "Video Guides" },
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-luBorder flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-luGold flex items-center justify-center font-bold text-black text-sm">
            LU
          </div>
          <span className="font-bold tracking-widest text-lg text-white">CONNECT</span>
        </Link>
        
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl md:hidden text-white hover:text-luGold transition-colors">
          ☰
        </button>

        <nav className="hidden md:flex gap-6 items-center">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-luGray hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col pt-24 px-6 gap-6 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)} className="text-xl text-luGray hover:text-luGold font-medium border-b border-luBorder pb-4">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
