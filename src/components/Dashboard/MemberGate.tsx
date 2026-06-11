"use client";
import { useState, useEffect } from "react";

export default function MemberGate() {
  const [isMember, setIsMember] = useState(true); // default true to avoid flash

  useEffect(() => {
    setIsMember(localStorage.getItem("lakespring_member") === "true");
  }, []);

  if (isMember) return null;

  return (
    <div className="w-full bg-[#034147] text-white px-6 py-3 flex items-center justify-between text-sm">
      <p className="text-cream-100/90">
        <span className="font-semibold text-white">Portfolio data is blurred.</span>{" "}
        Subscribe for full access to live positions, allocations, and trade history.
      </p>
      <a
        href="#"
        className="ml-4 flex-shrink-0 bg-white text-[#034147] font-semibold text-xs px-4 py-1.5 rounded-full hover:bg-cream-100 transition-colors"
      >
        Subscribe →
      </a>
    </div>
  );
}
