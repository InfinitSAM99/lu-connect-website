"use client";
import { useEffect, useState } from "react";

export default function AuthCallback() {
  const [status, setStatus] = useState("Logging you in...");

  useEffect(() => {
    const hash = window.location.hash || window.location.search;
    const appUrl = `luconnectnative://auth-callback${hash}`;
    
    // Automatically try to open the app after 1 second
    const timer = setTimeout(() => {
      window.location.href = appUrl;
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, border: '4px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 24 }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>{status}</h1>
      <p style={{ color: '#aab0bd', marginBottom: 32 }}>If the app doesn't open automatically, click below.</p>
      
      <a 
        href={`luconnectnative://auth-callback${window.location.hash || window.location.search}`} 
        style={{ backgroundColor: '#ef4444', color: '#fff', padding: '16px 32px', borderRadius: 12, fontWeight: 'bold', textDecoration: 'none' }}
      >
        Open LU Connect App
      </a>
    </div>
  );
}
