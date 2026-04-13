import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function Home() {
  const posts = getAllPosts();
  const recent = posts.slice(0, 12);

  return (
    <div className="mx-auto w-full max-w-[1384px] flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-12 max-w-[65ch] sm:mb-16">
        <p className="text-sm font-medium text-pewter">마크다운 · 정적 보내기</p>
        <h1 className="mt-2 text-[2rem] font-medium leading-tight tracking-tight text-carbon sm:text-[2.25rem]">
          정적 블로그
        </h1>
        <p className="mt-5 text-[15px] leading-[1.65] text-graphite">
          Next.js와 Tailwind로 만든 블로그입니다. 글은{" "}
          <code className="rounded bg-ash px-1.5 py-0.5 font-mono text-[0.8125rem] text-carbon">
            content
          </code>{" "}
          폴더의 마크다운을 gray-matter로 파싱하고, 본문은 HTML로 렌더링합니다.
        </p>
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex h-10 min-w-[160px] items-center justify-center rounded bg-electric px-6 text-sm font-medium text-white transition-[background-color,border-color,color] duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] hover:bg-[#3457b8]"
          >
            전체 글 보기
          </Link>
        </div>
      </header>

      <section aria-labelledby="recent-posts-heading">
        <h2
          id="recent-posts-heading"
          className="text-sm font-medium text-carbon"
        >
          최신 글
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-[15px] text-graphite">
            아직 게시물이 없습니다.{" "}
            <code className="rounded bg-ash px-1.5 py-0.5 font-mono text-[0.8125rem] text-carbon">
              content/&lt;topic&gt;/YYYYMMDD_slug.md
            </code>{" "}
            형식으로 파일을 추가하세요.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {recent.map((post) => (
              <li key={`${post.topic}/${post.slug}`}>
                <Link
                  href={`/blog/${post.topic}/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[12px] bg-ash p-5 transition-[background-color] duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] hover:bg-[#ebebeb]"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-pewter">
                    <time dateTime={post.frontmatter.date}>
                      {post.frontmatter.date}
                    </time>
                    <span aria-hidden className="text-pale-silver">
                      ·
                    </span>
                    <span className="font-mono text-[0.75rem] text-graphite">
                      {post.topic}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[1.0625rem] font-medium leading-snug text-carbon">
                    <span className="transition-colors duration-[330ms] group-hover:text-graphite">
                      {post.frontmatter.title}
                    </span>
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[0.875rem] leading-relaxed text-graphite">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 text-[0.875rem] font-medium text-pewter transition-colors duration-[330ms] group-hover:text-graphite">
                    글 읽기
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
