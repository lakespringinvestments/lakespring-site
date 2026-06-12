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

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Split content into segments — regular markdown or section-callout markers
type Segment =
  | { type: "markdown"; content: string }
  | { type: "callout"; label: string };

function parseSegments(content: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /:::section-callout\n([\s\S]*?)\n:::/g;
  let last = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > last) {
      segments.push({ type: "markdown", content: content.slice(last, match.index) });
    }
    const label = match[1].replace(/\*\*/g, "").trim();
    segments.push({ type: "callout", label });
    last = match.index + match[0].length;
  }

  if (last < content.length) {
    segments.push({ type: "markdown", content: content.slice(last) });
  }

  return segments;
}

// Shared markdown components
const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  img({ src, alt }) {
    if (!src) return null;
    return (
      <figure className="not-prose my-8 flex flex-col items-center">
        <div className="w-full max-w-2xl rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt ?? ""} className="w-full h-auto block mx-auto" />
        </div>
        {alt && (
          <figcaption className="text-xs text-ink-400 text-center mt-1.5 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="not-prose my-8 pl-6 border-l-[3px] border-teal-600">
        <div className="font-serif text-xl md:text-2xl text-teal-600 leading-[1.45] italic font-medium">
          {children}
        </div>
      </blockquote>
    );
  },
  h2({ children }) {
    return (
      <h2 className="font-sans text-2xl md:text-3xl font-semibold text-teal-600 leading-tight tracking-tight mt-14 mb-5">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="font-sans text-lg md:text-xl font-semibold text-ink-900 leading-tight mt-8 mb-3">
        {children}
      </h3>
    );
  },
  hr() {
    return <hr className="my-12 border-cream-200/60" />;
  },
  p({ children }) {
    return (
      <p className="text-ink-700 text-[17px] leading-[1.8] mb-5">{children}</p>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold text-teal-600">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return notFound();

  const segments = parseSegments(article.content);

  return (
    <article className="bg-transparent">
      {/* ── Header ── */}
      <header className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-10 md:pb-12">
        <Link
          href="/"
          className="text-xs uppercase tracking-wide text-ink-400 hover:text-teal-600 mb-8 inline-block transition-colors"
        >
          ← Stories &amp; Perspectives
        </Link>

        {article.byline && (
          <p className="text-xs uppercase tracking-[0.2em] text-sage-600 font-semibold mb-4">
            {article.byline}
          </p>
        )}

        <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] text-[#0a0a0a] leading-[1.08] tracking-tight font-medium max-w-4xl mb-6">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-ink-500 text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
            {article.excerpt}
          </p>
        )}

        {/* Author + date */}
        <div className="flex items-center gap-4 pt-6 border-t border-cream-200/60">
          <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">
              {(article.author ?? "L").charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-900">
              {article.author ?? "Brian L."}
            </p>
            <p className="text-xs text-ink-500">
              Principal &amp; CIO, Lakespring Investments
            </p>
            {article.date && (
              <p className="text-xs text-ink-400 mt-0.5">{formatDate(article.date)}</p>
            )}
          </div>
        </div>
      </header>

      {/* ── Cover image ── */}
      {article.coverImage && (
        <div className="max-w-6xl mx-auto px-6 mb-12 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full object-cover"
            style={{
              aspectRatio: "16/9",
              objectPosition: article.coverPosition ?? "center center",
              transform: article.coverScale ? `scale(${article.coverScale})` : undefined,
              transformOrigin: article.coverPosition ?? "center center",
            }}
          />
        </div>
      )}

      {/* ── Article body ── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="prose-lakespring-wide">
          {segments.map((seg, i) => {
            if (seg.type === "callout") {
              return (
                <div key={i} className="not-prose my-8 md:my-10">
                  <span className="inline-block bg-teal-600 text-white text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-md">
                    {seg.label}
                  </span>
                </div>
              );
            }
            return (
              <ReactMarkdown
                key={i}
                remarkPlugins={[remarkGfm]}
                components={mdComponents}
              >
                {seg.content}
              </ReactMarkdown>
            );
          })}
        </div>
      </div>

      {/* ── Email signup ── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="pt-10 border-t border-cream-200 max-w-2xl">
          <p className="text-2xl text-teal-600 mb-4 tracking-tight font-semibold">
            Enjoyed this?
          </p>
          <p className="text-ink-500 mb-6 text-sm">
            Subscribe for occasional notes on portfolio thinking.
          </p>
          <EmailSignup />
        </div>
      </div>
    </article>
  );
}
