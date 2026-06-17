"use client";
import { type ReactNode } from "react";

export default function BlurOverlay({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={className}>{children}</span>;
}
