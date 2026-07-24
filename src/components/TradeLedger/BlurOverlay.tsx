"use client";
import { type ReactNode } from "react";

export default function BlurOverlay({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block select-none pointer-events-none ${className}`}
      style={{ filter: "blur(8px)", opacity: 0.4 }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
