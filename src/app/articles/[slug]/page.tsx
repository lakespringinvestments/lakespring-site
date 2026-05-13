import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import EmailSignup from "@/components/EmailSignup";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} — Lakespring Investments`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return notFound();

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-10">
        <Link
          href="/articles"
          className="text-xs uppercase tracking-wide text-ink-400 hover:text-teal-600 mb-6 inline-block"
        >
          ← Articles
        </Link>
        <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">
          {article.date &&
            new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-teal-600 tracking-tight leading-tight">
          {article.title}
        </h1>
      </header>

      <div className="prose-lakespring">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-10 border-t border-cream-200">
        <p className="font-serif text-2xl text-teal-600 mb-4 tracking-tight">
          Enjoyed this?
        </p>
        <p className="text-ink-500 mb-6 text-sm">
          Subscribe for occasional notes on portfolio thinking.
        </p>
        <EmailSignup />
      </div>
    </article>
  );
}
