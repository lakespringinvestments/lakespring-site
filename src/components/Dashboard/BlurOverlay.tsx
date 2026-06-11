"use client";
import { useState } from "react";

interface BlurOverlayProps {
  children: React.ReactNode;
  className?: string;
}

// Simple client-side membership check using localStorage
// In future this will be replaced by real auth/Stripe check
function useIsMember(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("lakespring_member") === "true";
}

export default function BlurOverlay({ children, className = "" }: BlurOverlayProps) {
  const [member] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lakespring_member") === "true";
  });

  if (member) return <span className={className}>{children}</span>;

  return (
    <span
      className={`select-none pointer-events-none ${className}`}
      style={{
        filter: "blur(6px)",
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
