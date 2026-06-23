"use client";

import { useState, type FormEvent } from "react";

interface Props {
  /** Headline above the form */
  heading?: string;
  /** Supporting copy below the headline */
  description?: string;
  /** Button label */
  buttonText?: string;
  /** Visual variant */
  variant?: "inline" | "card" | "hero";
}

export default function NewsletterSignup({
  heading = "Stay in the loop",
  description = "Weekly portfolio updates, trade alerts, and analysis — delivered to your inbox.",
  buttonText = "Subscribe",
  variant = "card",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(
          data.alreadySubscribed
            ? "You're already subscribed — welcome back."
            : "You're in. Check your inbox for a welcome note."
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={wrapperClass(variant)}>
        <div className="flex items-center gap-3">
          <span className="text-sage-600 text-lg">✓</span>
          <p className="text-ink-700 text-sm font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass(variant)}>
      {heading && (
        <h3 className={variant === "hero"
          ? "text-2xl md:text-3xl font-semibold text-teal-600 mb-2"
          : "text-sm font-semibold text-teal-600 mb-1"
        }>
          {heading}
        </h3>
      )}
      {description && (
        <p className={variant === "hero"
          ? "text-ink-500 text-base leading-relaxed mb-6 max-w-md"
          : "text-ink-400 text-xs leading-relaxed mb-4"
        }>
          {description}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="you@email.com"
          required
          className="flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg border border-cream-200 bg-white
                     text-ink-900 placeholder:text-ink-300
                     focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600
                     transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 text-sm font-medium rounded-lg text-white
                     transition-all duration-150 whitespace-nowrap
                     disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#034147" }}
          onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.background = "#045a63"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#034147"; }}
        >
          {status === "loading" ? "..." : buttonText}
        </button>
      </form>

      {status === "error" && message && (
        <p className="text-red-500 text-xs mt-2">{message}</p>
      )}

      <p className="text-ink-300 text-[10px] mt-3">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

function wrapperClass(variant: "inline" | "card" | "hero"): string {
  switch (variant) {
    case "hero":
      return "py-8";
    case "card":
      return "bg-white rounded-2xl border border-cream-200 p-6";
    case "inline":
      return "py-6 border-t border-cream-200";
    default:
      return "";
  }
}
