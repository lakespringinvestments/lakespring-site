"use client";
import { type ReactNode } from "react";

export default function BlurOverlay({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block select-none pointer-events-none ${className}`}
      style={{ filter: "blur(4px)", opacity: 0.55 }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
