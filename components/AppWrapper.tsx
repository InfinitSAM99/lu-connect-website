"use client";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide the spinner after 1.5 seconds on first load
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Spinner />;

  return <>{children}</>;
}
