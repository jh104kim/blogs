import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/PostBody";
import { getPost, getStaticPostParams } from "@/lib/content";

type PageProps = {
  params: Promise<{ topic: string; slug: string }>;
};

export function generateStaticParams() {
  return getStaticPostParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic, slug } = await params;
  const post = getPost(topic, slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description ?? post.frontmatter.title,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { topic, slug } = await params;
  const post = getPost(topic, slug);
  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-[min(65ch,100%)] flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <nav
        className="mb-8 text-[0.8125rem] text-pewter"
        aria-label="breadcrumb"
      >
        <Link
          href="/"
          className="transition-colors duration-[330ms] hover:text-graphite"
        >
          홈
        </Link>
        <span className="mx-2 text-pale-silver">/</span>
        <Link
          href="/blog"
          className="transition-colors duration-[330ms] hover:text-graphite"
        >
          블로그
        </Link>
        <span className="mx-2 text-pale-silver">/</span>
        <span className="font-mono text-graphite">{topic}</span>
      </nav>

      <header className="border-b border-cloud pb-10">
        <p className="text-[0.8125rem] text-pewter">
          <time dateTime={post.frontmatter.date}>{post.frontmatter.date}</time>
          <span className="mx-2 text-pale-silver">·</span>
          <span className="font-mono text-graphite">{post.topic}</span>
        </p>
        <h1 className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight text-carbon sm:text-[2rem]">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.description ? (
          <p className="mt-5 text-[15px] leading-[1.65] text-graphite">
            {post.frontmatter.description}
          </p>
        ) : null}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <li
                key={tag}
                className="rounded bg-ash px-3 py-1 text-[0.75rem] font-medium text-graphite"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <article className="py-10 sm:py-12">
        <PostBody html={post.bodyHtml} />
      </article>
    </div>
  );
}
