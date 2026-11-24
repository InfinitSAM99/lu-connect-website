"use client";
import LULoader from "./LULoader";

export default function Spinner({ show = true }: { show?: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col justify-center items-center">
      <LULoader size={180} text="Connecting" />
    </div>
  );
}
