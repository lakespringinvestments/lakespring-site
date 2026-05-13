import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Articles — Lakespring Investments",
  description: "Notes on portfolio thinking, conviction, and the long game.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-sage-500 mb-3">
          The journal
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-teal-600 tracking-tight">
          Articles
        </h1>
      </header>

      {articles.length === 0 ? (
        <p className="text-ink-500">No articles yet. Check back soon.</p>
      ) : (
        <ul className="space-y-10">
          {articles.map((article) => (
            <li key={article.slug} className="border-b border-cream-200 pb-10 last:border-0">
              <Link href={`/articles/${article.slug}`} className="group block">
                <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">
                  {article.date &&
                    new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-teal-600 group-hover:text-sage-500 tracking-tight mb-3 transition-colors">
                  {article.title}
                </h2>
                <p className="text-ink-500 leading-relaxed">
                  {article.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
