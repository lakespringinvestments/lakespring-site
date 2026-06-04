"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { ArticleMeta } from "@/lib/articles";

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const FALLBACK_TILES = [
  { bg: "bg-teal-600", title: "text-cream-50", byline: "text-sage-300", date: "text-sage-300/80", border: "" },
  { bg: "bg-sage-500", title: "text-cream-50", byline: "text-teal-800", date: "text-teal-800/80", border: "" },
  { bg: "bg-[#0A0A0A]", title: "text-cream-50", byline: "text-sage-300", date: "text-cream-100/50", border: "" },
  { bg: "bg-cream-100", title: "text-teal-600", byline: "text-sage-700", date: "text-ink-400", border: "border border-cream-200" },
];

export default function LatestCarousel({ articles }: { articles: ArticleMeta[] }) {
  const [index, setIndex] = useState(0);

  // Total number of pages (3 tiles per page)
  const pageCount = Math.ceil(articles.length / 3);
  const canPrev = index > 0;
  const canNext = index < pageCount - 1;

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(pageCount - 1, i + 1));

  // Slice the two visible articles
  const visible = articles.slice(index * 3, index * 3 + 3);

  if (articles.length === 0) return null;

  return (
    <section className="bg-transparent border-b border-cream-200/60">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-14">

        {/* Section header + nav controls */}
        <div className="flex items-center justify-between mb-7">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500">
            Latest
          </p>
          <div className="flex items-center gap-3">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    i === index
                      ? "w-4 h-1.5 bg-teal-600"
                      : "w-1.5 h-1.5 bg-cream-300 hover:bg-teal-400"
                  }`}
                />
              ))}
            </div>
            {/* Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={prev}
                disabled={!canPrev}
                aria-label="Previous"
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                  canPrev
                    ? "border-cream-300 text-ink-600 hover:border-teal-600 hover:text-teal-600"
                    : "border-cream-200 text-cream-300 cursor-not-allowed"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={!canNext}
                aria-label="Next"
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                  canNext
                    ? "border-cream-300 text-ink-600 hover:border-teal-600 hover:text-teal-600"
                    : "border-cream-200 text-cream-300 cursor-not-allowed"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tiles — always 2 columns on md+, stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {visible.map((article, i) => {
            const hasImage = Boolean(article.coverImage);
            const fallback = FALLBACK_TILES[(index * 3 + i) % FALLBACK_TILES.length];

            return (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group relative block aspect-[16/9] overflow-hidden rounded-xl"
              >
                {hasImage ? (
                  <>
                    <Image
                      src={article.coverImage as string}
                      alt={article.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{
                        objectPosition: article.coverPosition ?? "center center",
                        ...(article.coverScale
                          ? { transform: `scale(${article.coverScale})`, transformOrigin: "center center" }
                          : {}),
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/0" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                      {article.byline && (
                        <span className="inline-block bg-black/80 w-fit text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded mb-2">
                          {article.byline}
                        </span>
                      )}
                      <h3 className="font-serif text-xl md:text-2xl text-cream-50 leading-[1.1] tracking-tight font-medium">
                        {article.title}
                      </h3>
                      {article.date && (
                        <p className="mt-2 text-[11px] uppercase tracking-wide text-cream-100/60">
                          {formatDate(article.date)}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    className={`absolute inset-0 ${fallback.bg} ${fallback.border} flex flex-col justify-end p-5 md:p-6 transition-opacity duration-300 group-hover:opacity-95`}
                  >
                    <span className="inline-block bg-black/80 w-fit text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded mb-2">
                      {article.byline ?? "Note"}
                    </span>
                    <h3 className={`font-serif text-xl md:text-2xl ${fallback.title} leading-[1.1] tracking-tight font-medium`}>
                      {article.title}
                    </h3>
                    {article.date && (
                      <p className={`mt-2 text-[11px] uppercase tracking-wide ${fallback.date}`}>
                        {formatDate(article.date)}
                      </p>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
