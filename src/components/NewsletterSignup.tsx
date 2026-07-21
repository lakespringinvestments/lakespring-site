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
  variant?: "inline" | "card" | "hero" | "minimal";
  /** Dark background mode (e.g. inside the teal footer) */
  dark?: boolean;
  /** Called once the subscribe request actually succeeds — for gating content on a real signup */
  onSuccess?: () => void;
}

export default function NewsletterSignup({
  heading = "Stay in the loop",
  description = "Weekly portfolio updates, trade alerts, and analysis — delivered to your inbox.",
  buttonText = "Subscribe",
  variant = "card",
  dark = false,
  onSuccess,
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
        onSuccess?.();
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const showHeading = variant !== "minimal" && heading;
  const showDescription = variant !== "minimal" && description;

  if (status === "success") {
    return (
      <div className={wrapperClass(variant, dark)}>
        <div className="flex items-center gap-3">
          <span className={dark ? "text-white text-lg" : "text-sage-600 text-lg"}>✓</span>
          <p className={dark ? "text-white text-sm font-medium" : "text-ink-700 text-sm font-medium"}>
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass(variant, dark)}>
      {showHeading && (
        <h3 className={
          variant === "hero"
            ? `text-2xl md:text-3xl font-semibold mb-2 ${dark ? "text-white" : "text-teal-600"}`
            : `text-sm font-semibold mb-1 ${dark ? "text-white" : "text-teal-600"}`
        }>
          {heading}
        </h3>
      )}
      {showDescription && (
        <p className={
          variant === "hero"
            ? `text-base leading-relaxed mb-6 max-w-md ${dark ? "text-white/70" : "text-ink-500"}`
            : `text-xs leading-relaxed mb-4 ${dark ? "text-white/60" : "text-ink-400"}`
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
          className={`flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg border transition-colors
            focus:outline-none focus:ring-2
            ${dark
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-white/30 focus:border-white/40"
              : "bg-white border-cream-200 text-ink-900 placeholder:text-ink-300 focus:ring-teal-600/20 focus:border-teal-600"
            }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap
            disabled:opacity-60 disabled:cursor-not-allowed
            ${dark
              ? "bg-white text-teal-600 hover:bg-cream-50"
              : "bg-[#034147] text-white hover:bg-[#045a63]"
            }`}
        >
          {status === "loading" ? "..." : buttonText}
        </button>
      </form>

      {status === "error" && message && (
        <p className={`text-xs mt-2 ${dark ? "text-red-300" : "text-red-500"}`}>{message}</p>
      )}

      <p className={`text-[10px] mt-3 ${dark ? "text-white/30" : "text-ink-300"}`}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

function wrapperClass(variant: string, dark: boolean): string {
  switch (variant) {
    case "hero":
      return "py-8";
    case "card":
      return dark
        ? "rounded-2xl p-6"
        : "bg-white rounded-2xl border border-cream-200 p-6";
    case "inline":
      return dark ? "py-6" : "py-6 border-t border-cream-200";
    case "minimal":
      return "";
    default:
      return "";
  }
}
