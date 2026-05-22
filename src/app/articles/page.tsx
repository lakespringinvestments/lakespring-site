import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Insights — Lakespring Investments",
  description: "Notes on portfolio thinking, conviction, and the long game.",
};

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-teal-600 tracking-tight leading-[1.05] mb-6 font-semibold max-w-4xl">
            Insights
          </h1>
          <p className="text-ink-500 text-lg leading-relaxed max-w-3xl">
            Notes on portfolio thinking, conviction, and the long game.
            Deep dives on the First Principles holdings, plus the
            occasional Canadian personal-finance and wealth-preservation
            piece.
          </p>
        </div>
      </section>

      {/* Articles list */}
      <section className="bg-transparent border-t border-cream-200/60">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          {articles.length === 0 ? (
            <p className="text-ink-500">No articles yet. Check back soon.</p>
          ) : (
            <ul className="space-y-10">
              {articles.map((article) => (
                <li
                  key={article.slug}
                  className="border-b border-cream-200/60 pb-10 last:border-0"
                >
                  <Link href={`/articles/${article.slug}`} className="group block">
                    <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">
                      {article.date &&
                        new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </p>
                    <h2 className="text-2xl md:text-3xl text-teal-600 group-hover:text-sage-500 tracking-tight mb-3 transition-colors font-semibold">
                      {article.title}
                    </h2>
                    <p className="text-ink-500 leading-relaxed max-w-3xl">
                      {article.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
