import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  /** Optional path to a cover image (e.g. "/article-images/foo.jpg"). When
   *  absent, the grid renders a color-blocked fallback tile. */
  coverImage?: string;
  /** Optional thematic byline shown above the title on the grid tile
   *  (e.g. "Holdings deep-dive", "On Canadian wealth"). */
  byline?: string;
  /** When true, this article occupies the wide featured slot in the masonry grid.
   *  Only one article should be featured at a time. */
  featured?: boolean;
};

export type Article = ArticleMeta & {
  content: string;
};

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      coverImage: data.coverImage ?? undefined,
      byline: data.byline ?? undefined,
      featured: data.featured ?? false,
    };
  });
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? undefined,
    byline: data.byline ?? undefined,
    featured: data.featured ?? false,
    content,
  };
}
