import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/articles";
import LatestCarousel from "@/components/Articles/LatestCarousel";

export const metadata = {
  title: "Lakespring Investments",
  description:
    "Field notes on concentrated positions in transformative technology — AI, digital assets, energy.",
};

const FALLBACK_TILES = [
  {
    bg: "bg-teal-600",
    title: "text-cream-50",
    byline: "text-sage-300",
    excerpt: "text-cream-100/80",
    date: "text-sage-300/80",
    border: "",
  },
  {
    bg: "bg-sage-500",
    title: "text-cream-50",
    byline: "text-teal-800",
    excerpt: "text-sage-100",
    date: "text-teal-800/80",
    border: "",
  },
  {
    bg: "bg-cream-100",
    title: "text-teal-600",
    byline: "text-sage-700",
    excerpt: "text-ink-500",
    date: "text-ink-400",
    border: "border border-cream-200",
  },
  {
    bg: "bg-[#0A0A0A]",
    title: "text-cream-50",
    byline: "text-sage-300",
    excerpt: "text-cream-100/70",
    date: "text-cream-100/50",
    border: "",
  },
];

const FEATURED_SLUG = "musk-industrial-complex";

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomePage() {
  const allArticles = getAllArticles();

  // Pinned grid — Holdings deep-dives only
  const pinnedArticles = allArticles.filter(
    (a) => a.byline?.toLowerCase() === "holdings deep-dive"
  );

  // Latest carousel — everything else, capped at 3 most recent
  const latestArticles = allArticles
    .filter((a) => a.byline?.toLowerCase() !== "holdings deep-dive")
    .slice(0, 3);

  const featuredIndex = pinnedArticles.findIndex(
    (a) => a.slug === FEATURED_SLUG || a.featured
  );
  const featured =
    featuredIndex !== -1 ? pinnedArticles[featuredIndex] : pinnedArticles[0];
  const rest = pinnedArticles.filter((a) => a.slug !== featured?.slug);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-transparent">
        <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-12 md:pb-14">
          {/*
            Two-line title:
            Line 1 — "Stories" plain black serif
            Line 2 — "& Perspectives" with sage/teal highlight behind it
            The highlight uses a linear background that only spans the text
            width, padded slightly, sitting like a marker stroke.
          */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#0a0a0a] leading-[1.05] tracking-tight font-medium">
            <span className="block">Stories</span>
            <span className="block mt-1">
              <span
                className="inline"
                style={{
                  background: "linear-gradient(to top, rgba(29, 158, 117, 0.22) 45%, transparent 45%)",
                  padding: "0 10px 4px 2px",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                &amp; Perspectives
              </span>
            </span>
          </h1>
        </div>
      </section>

      {/* ── Latest carousel (only rendered when articles are tagged latest: true) ── */}
      {latestArticles.length > 0 && (
        <LatestCarousel articles={latestArticles} />
      )}

      {/* ── Pinned editorial masonry grid ── */}
      <section className="bg-transparent border-t border-cream-200/60">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-7">
            Featured
          </p>
          {pinnedArticles.length === 0 ? (
            <p className="text-ink-500">No articles yet. Check back soon.</p>
          ) : (
            <div className="space-y-5 md:space-y-6">

              {/* Row 1: featured wide + side tile */}
              {featured && (
                <div className="grid grid-cols-1 md:grid-cols-[1.65fr_1fr] gap-5 md:gap-6">
                  <FeaturedTile article={featured} />
                  {rest[0] && (
                    <ArticleTile
                      article={rest[0]}
                      index={0}
                      className="aspect-[4/3] md:aspect-auto"
                    />
                  )}
                </div>
              )}

              {/* Row 2: three equal tiles */}
              {rest.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {rest.slice(1, 4).map((article, i) => (
                    <ArticleTile
                      key={article.slug}
                      article={article}
                      index={i + 1}
                      className="aspect-[4/3]"
                    />
                  ))}
                </div>
              )}

              {/* Overflow: pairs */}
              {rest.length > 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  {rest.slice(4).map((article, i) => (
                    <ArticleTile
                      key={article.slug}
                      article={article}
                      index={i + 4}
                      className="aspect-[4/3]"
                    />
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ── Featured tile ───────────────────────────────────────────────────────────

function FeaturedTile({
  article,
}: {
  article: ReturnType<typeof getAllArticles>[number];
}) {
  const hasImage = Boolean(article.coverImage) && !article.hideTileImage;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative block aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl"
    >
      {hasImage ? (
        <>
          <Image
            src={article.coverImage as string}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 768px) 62vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{
              objectPosition: article.coverPosition ?? "center center",
              ...(article.coverScale ? { transform: `scale(${article.coverScale})`, transformOrigin: "center center" } : {}),
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/0" />
          <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
            {article.byline && (
              <span className="inline-block bg-black/80 text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded mb-3 w-fit">
                {article.byline}
              </span>
            )}
            <h2 className="font-serif text-3xl md:text-4xl text-cream-50 leading-[1.08] tracking-tight font-medium">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="mt-3 text-sm text-cream-100/75 leading-relaxed line-clamp-2 max-w-xl">
                {article.excerpt}
              </p>
            )}
            {article.date && (
              <p className="mt-4 text-[11px] uppercase tracking-wide text-cream-100/60">
                {formatDate(article.date)}
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-[#0A0A0A] flex flex-col justify-end p-7 md:p-9 transition-opacity duration-300 group-hover:opacity-95">
          {article.byline && (
            <span className="inline-block bg-black/80 text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded mb-3 w-fit">
              {article.byline}
            </span>
          )}
          <h2 className="font-serif text-3xl md:text-4xl text-cream-50 leading-[1.08] tracking-tight font-medium">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mt-3 text-sm text-cream-100/70 leading-relaxed line-clamp-2 max-w-xl">
              {article.excerpt}
            </p>
          )}
          {article.date && (
            <p className="mt-4 text-[11px] uppercase tracking-wide text-cream-100/50">
              {formatDate(article.date)}
            </p>
          )}
        </div>
      )}
    </Link>
  );
}

// ── Regular tile ────────────────────────────────────────────────────────────

function ArticleTile({
  article,
  index,
  className = "",
}: {
  article: ReturnType<typeof getAllArticles>[number];
  index: number;
  className?: string;
}) {
  const hasImage = Boolean(article.coverImage) && !article.hideTileImage;
  const fallback = FALLBACK_TILES[index % FALLBACK_TILES.length];

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group relative block overflow-hidden rounded-xl ${className}`}
    >
      {hasImage ? (
        <>
          <Image
            src={article.coverImage as string}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{
              objectPosition: article.coverPosition ?? "center center",
              ...(article.coverScale ? { transform: `scale(${article.coverScale})`, transformOrigin: "center center" } : {}),
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/0" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
            {article.byline && (
              <span className="inline-block bg-black/80 text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded mb-2 w-fit">
                {article.byline}
              </span>
            )}
            <h2 className="font-serif text-xl md:text-2xl text-cream-50 leading-[1.1] tracking-tight font-medium">
              {article.title}
            </h2>
            {article.date && (
              <p className="mt-3 text-[11px] uppercase tracking-wide text-cream-100/70">
                {formatDate(article.date)}
              </p>
            )}
          </div>
        </>
      ) : (
        <div
          className={`absolute inset-0 ${fallback.bg} ${fallback.border} flex flex-col justify-end p-6 md:p-7 transition-opacity duration-300 group-hover:opacity-95`}
        >
          <span className="inline-block bg-black/80 text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded mb-2 w-fit">
            {article.byline ?? "Note"}
          </span>
          <h2 className={`font-serif text-xl md:text-2xl ${fallback.title} leading-[1.1] tracking-tight font-medium`}>
            {article.title}
          </h2>
          {article.excerpt && (
            <p className={`mt-3 text-sm ${fallback.excerpt} leading-relaxed line-clamp-2`}>
              {article.excerpt}
            </p>
          )}
          {article.date && (
            <p className={`mt-3 text-[11px] uppercase tracking-wide ${fallback.date}`}>
              {formatDate(article.date)}
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
