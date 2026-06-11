import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  byline?: string;
  featured?: boolean;
  latest?: boolean;
  author?: string;
  coverPosition?: string;
  coverScale?: string;
  /** When true, the tile on the homepage uses a color block instead of the cover image */
  hideTileImage?: boolean;
  /** When true, article is excluded from all listings */
  hidden?: boolean;
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
      hidden: data.hidden ?? false,
      excerpt: data.excerpt ?? "",
      coverImage: data.coverImage ?? undefined,
      byline: data.byline ?? undefined,
      featured: data.featured ?? false,
      latest: data.latest ?? false,
      author: data.author ?? undefined,
      coverPosition: data.coverPosition ?? undefined,
      coverScale: data.coverScale ?? undefined,
      hideTileImage: data.hideTileImage ?? false,
    };
  });
  return articles.filter((a) => !a.hidden).sort((a, b) => (a.date < b.date ? 1 : -1));
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
    latest: data.latest ?? false,
    author: data.author ?? undefined,
    coverPosition: data.coverPosition ?? undefined,
    coverScale: data.coverScale ?? undefined,
    hideTileImage: data.hideTileImage ?? false,
    content,
  };
}
