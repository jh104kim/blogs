import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml, markdownToPlainExcerpt } from "@/lib/markdown";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PostFrontmatter = {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
};

export type Post = {
  topic: string;
  slug: string;
  frontmatter: PostFrontmatter;
  /** remark → rehype 로 변환된 본문 HTML */
  bodyHtml: string;
  /** 목록·카드용 짧은 요약(설명 없을 때 마크다운에서 추출) */
  excerpt: string;
  filePath: string;
};

function isTopicDir(name: string): boolean {
  return !name.startsWith(".") && name !== "node_modules";
}

export function getContentDir(): string {
  return CONTENT_DIR;
}

function readMdFiles(topicPath: string, topic: string): Post[] {
  if (!fs.existsSync(topicPath)) return [];
  const entries = fs.readdirSync(topicPath, { withFileTypes: true });
  const posts: Post[] = [];

  for (const ent of entries) {
    if (!ent.isFile() || !ent.name.endsWith(".md")) continue;
    const slug = ent.name.replace(/\.md$/i, "");
    const filePath = path.join(topicPath, ent.name);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as Partial<PostFrontmatter>;
    if (!fm.title || !fm.date) {
      throw new Error(
        `Missing title or date in frontmatter: ${path.join(topic, ent.name)}`,
      );
    }
    const md = content.trim();
    const bodyHtml = markdownToHtml(md);
    const excerpt =
      fm.description?.trim() || markdownToPlainExcerpt(md);

    posts.push({
      topic,
      slug,
      frontmatter: {
        title: fm.title,
        date: fm.date,
        description: fm.description,
        tags: fm.tags,
      },
      bodyHtml,
      excerpt,
      filePath,
    });
  }
  return posts;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const topics = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && isTopicDir(d.name))
    .map((d) => d.name);

  const all: Post[] = [];
  for (const topic of topics) {
    all.push(...readMdFiles(path.join(CONTENT_DIR, topic), topic));
  }

  return all.sort((a, b) => {
    const da = a.frontmatter.date.localeCompare(b.frontmatter.date);
    return da === 0 ? a.slug.localeCompare(b.slug) : -da;
  });
}

export function getPost(topic: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, topic, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;
  if (!fm.title || !fm.date) return null;
  const md = content.trim();
  const bodyHtml = markdownToHtml(md);
  const excerpt =
    fm.description?.trim() || markdownToPlainExcerpt(md);

  return {
    topic,
    slug,
    frontmatter: {
      title: fm.title,
      date: fm.date,
      description: fm.description,
      tags: fm.tags,
    },
    bodyHtml,
    excerpt,
    filePath,
  };
}

export function getStaticPostParams(): { topic: string; slug: string }[] {
  return getAllPosts().map((p) => ({ topic: p.topic, slug: p.slug }));
}
