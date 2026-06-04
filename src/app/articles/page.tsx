import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "News & Perspectives — Lakespring Investments",
  description:
    "Field notes on the holdings, philosophy of generational wealth, and Canadian wealth-preservation pieces.",
};

// Color-blocked fallback palette, rotated through for articles without coverImage.
// Each entry: background + text/eyebrow colors that read on it.
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

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      {/* Hero — transparent, ambient wash shows through */}
      <section className="bg-transparent">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.25em] text-sage-500 mb-5">
            The Journal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-teal-600 leading-[1.05] tracking-tight font-medium max-w-4xl">
            News &amp; Perspectives
          </h1>
          <p className="mt-6 text-ink-500 text-lg leading-relaxed max-w-3xl">
            Field notes on the holdings, the philosophy of generational
            wealth, and Canadian personal-finance pieces. Written as I work
            through them.
          </p>
        </div>
      </section>

      {/* Uniform grid */}
      <section className="bg-transparent border-t border-cream-200/60">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          {articles.length === 0 ? (
            <p className="text-ink-500">No articles yet. Check back soon.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {articles.map((article, i) => {
                const hasImage = Boolean(article.coverImage);
                const fallback = FALLBACK_TILES[i % FALLBACK_TILES.length];

                return (
                  <li key={article.slug}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group relative block aspect-square overflow-hidden rounded-xl"
                    >
                      {hasImage ? (
                        <>
                          {/* Cover image */}
                          <Image
                            src={article.coverImage as string}
                            alt={article.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          {/* Bottom scrim so overlay text stays legible */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/0" />
                          {/* Overlay content */}
                          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                            {article.byline && (
                              <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 mb-2 font-semibold">
                                {article.byline}
                              </p>
                            )}
                            <h2 className="font-serif text-2xl md:text-[1.7rem] text-cream-50 leading-[1.1] tracking-tight font-medium">
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
                        // Color-blocked fallback tile
                        <div
                          className={`absolute inset-0 ${fallback.bg} ${fallback.border} flex flex-col justify-end p-6 md:p-7 transition-opacity duration-300 group-hover:opacity-95`}
                        >
                          {article.byline ? (
                            <p
                              className={`text-[10px] uppercase tracking-[0.2em] ${fallback.byline} mb-2 font-semibold`}
                            >
                              {article.byline}
                            </p>
                          ) : (
                            <p
                              className={`text-[10px] uppercase tracking-[0.2em] ${fallback.byline} mb-2 font-semibold`}
                            >
                              Note
                            </p>
                          )}
                          <h2
                            className={`font-serif text-2xl md:text-[1.7rem] ${fallback.title} leading-[1.1] tracking-tight font-medium`}
                          >
                            {article.title}
                          </h2>
                          {article.excerpt && (
                            <p
                              className={`mt-3 text-sm ${fallback.excerpt} leading-relaxed line-clamp-2`}
                            >
                              {article.excerpt}
                            </p>
                          )}
                          {article.date && (
                            <p
                              className={`mt-3 text-[11px] uppercase tracking-wide ${fallback.date}`}
                            >
                              {formatDate(article.date)}
                            </p>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
