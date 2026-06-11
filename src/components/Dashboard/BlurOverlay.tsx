"use client";
import { useState, type ReactNode } from "react";

export default function BlurOverlay({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  const [member] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lakespring_member") === "true";
  });

  if (member) return <span className={className}>{children}</span>;

  return (
    <span
      className={`select-none pointer-events-none ${className}`}
      style={{ filter: "blur(6px)" }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
