"use client";
import { useState } from "react";

interface BlurOverlayProps {
  children: React.ReactNode;
  className?: string;
}

export default function BlurOverlay({ children, className = "" }: BlurOverlayProps) {
  const [member] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lakespring_member") === "true";
  });

  if (member) return <span className={className}>{children}</span>;

  return (
    <span
      className={`select-none pointer-events-none ${className}`}
      style={{ filter: "blur(6px)", userSelect: "none" as const }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
