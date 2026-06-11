"use client";
import { useState, useEffect } from "react";

export default function MemberGate() {
  const [isMember, setIsMember] = useState(true);

  useEffect(() => {
    setIsMember(localStorage.getItem("lakespring_member") === "true");
  }, []);

  if (isMember) return null;

  return (
    <div className="w-full bg-black text-white px-6 py-3 flex items-center justify-between text-sm">
      <p className="font-semibold text-white">
        Subscribe for full access to live positions, weekly analysis, and trade history.
      </p>
      <a
        href="#"
        className="ml-4 flex-shrink-0 bg-white text-black font-semibold text-xs px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        Subscribe →
      </a>
    </div>
  );
}
