"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterQuoteProps {
  text: string;
  speed?: number; // ms per character
}

export default function TypewriterQuote({ text, speed = 28 }: TypewriterQuoteProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Start animation when element scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  // Type characters one by one
  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed]);

  return (
    <blockquote
      ref={ref}
      className="border-l-4 border-sage-500 pl-6 max-w-2xl"
      style={{ minHeight: "7rem" }}
    >
      <span
        className="text-2xl md:text-3xl text-teal-600 font-medium leading-snug"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {displayed}
        {/* Blinking cursor while typing */}
        {displayed.length < text.length && (
          <span className="animate-pulse text-sage-500">|</span>
        )}
      </span>
    </blockquote>
  );
}
