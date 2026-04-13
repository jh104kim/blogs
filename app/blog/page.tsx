import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-[65ch] flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-12 border-b border-cloud pb-10">
        <h1 className="text-[1.75rem] font-medium leading-tight text-carbon">
          블로그
        </h1>
        <p className="mt-3 text-[15px] leading-[1.65] text-graphite">
          주제별 폴더와 마크다운으로 관리되는 글 목록입니다.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[15px] text-graphite">
          아직 게시글이 없습니다.{" "}
          <code className="rounded bg-ash px-1.5 py-0.5 font-mono text-[0.8125rem] text-carbon">
            content/&lt;topic&gt;/YYYYMMDD_slug.md
          </code>{" "}
          형식으로 파일을 추가하세요.
        </p>
      ) : (
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={`${post.topic}/${post.slug}`}>
              <article>
                <p className="text-[0.8125rem] text-pewter">
                  <span className="font-mono text-graphite">{post.topic}</span>
                  <span className="mx-2 text-pale-silver">·</span>
                  <time dateTime={post.frontmatter.date}>
                    {post.frontmatter.date}
                  </time>
                </p>
                <h2 className="mt-2 text-[1.25rem] font-medium leading-snug">
                  <Link
                    href={`/blog/${post.topic}/${post.slug}`}
                    className="text-carbon transition-colors duration-[330ms] hover:text-graphite"
                  >
                    {post.frontmatter.title}
                  </Link>
                </h2>
                <p className="mt-3 text-[15px] leading-[1.65] text-graphite">
                  {post.excerpt}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
