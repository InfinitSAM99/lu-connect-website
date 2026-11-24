"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, X, ShieldCheck, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/download", label: "Download App" },
    { href: "/guides", label: "Video Guides" },
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Us" },
    { href: "/account", label: "My Account" }, // <-- ADDED
  ];

  return (
    <>
      {/* Top Header */}
      <header className="bg-surface/80 backdrop-blur-md border-b border-border py-[15px] px-5 flex justify-between items-center sticky top-0 z-[100] transition-colors">
        <Link href="/" className="flex items-center gap-[10px]" onClick={() => setIsOpen(false)}>
          <div className="w-10 h-10 border-[3px] border-luRed rounded-[10px] flex items-center justify-center font-black text-lg text-text">
            LU
          </div>
          <span className="text-xl font-black text-luRed tracking-[-1px]">CONNECT</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-surface border border-border hover:bg-border transition-colors text-text"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Hamburger Menu */}
          <button onClick={() => setIsOpen(!isOpen)} className="block md:hidden text-2xl text-text p-1">
            {isOpen ? <X size={24} /> : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar / Drawer */}
      <div
        className={`fixed top-[70px] left-0 w-[220px] md:w-[250px] h-[calc(100vh-70px)] bg-surface border-r border-border z-[90] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Scrollable Links Area */}
        <div className="flex-1 overflow-y-auto py-4">
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: isOpen ? `${i * 50}ms` : '0ms' }}
                className={`block py-3 px-5 text-sm font-semibold border-l-[3px] transition-all duration-300 ${
                  isActive
                    ? 'text-text bg-luRed/10 border-luRed'
                    : 'text-muted border-transparent hover:text-text hover:bg-luRed/10 hover:border-luRed'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Fixed Admin Portal Link at Bottom */}
        <div className="border-t border-border/50 pb-4 shrink-0">
          <Link
            href="/admin-download"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-l-[3px] transition-all duration-300 ${
              pathname === "/admin-download"
                ? 'text-luGold bg-luGold/10 border-luGold'
                : 'text-neutral-500 border-transparent hover:text-luGold hover:bg-luGold/10 hover:border-luGold'
            }`}
          >
            <ShieldCheck size={16} className={pathname === "/admin-download" ? "text-luGold" : "text-neutral-500"} />
            Admin Portal
          </Link>
        </div>
      </div>
    </>
  );
}
