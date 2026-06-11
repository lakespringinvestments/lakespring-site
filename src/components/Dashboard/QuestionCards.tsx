"use client";

import { useEffect, useRef, useState } from "react";

const questions = [
  {
    num: "01",
    label: "Execution power",
    body: "Does the company have the engineering velocity, capital, and leadership to actually deliver on what it's promising?",
    bg: "#1D9E75",
  },
  {
    num: "02",
    label: "Structural moat",
    body: "Does it have compounding advantages — network effects, vertical integration, switching costs, or regulatory entrenchment — that widen as the transformation accelerates?",
    bg: "#0D6B5E",
  },
  {
    num: "03",
    label: "Decade durability",
    body: "Can we say with confidence this business will exist and matter ten years from now, through all the volatility and disruption of the AI buildout?",
    bg: "#034147",
  },
];

export default function QuestionCards() {
  const [visible, setVisible] = useState<boolean[]>([false, false, false]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger each card 180ms apart
          questions.forEach((_, i) => {
            setTimeout(() => {
              setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 180);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {questions.map((q, i) => (
        <div
          key={q.num}
          className="rounded-xl p-5"
          style={{
            background: q.bg,
            opacity: visible[i] ? 1 : 0,
            transform: visible[i] ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {q.num}
          </p>
          <p className="text-base font-semibold mb-2 text-white">{q.label}</p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            {q.body}
          </p>
        </div>
      ))}
    </div>
  );
}
