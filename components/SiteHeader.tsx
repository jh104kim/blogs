"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinkClass =
  "rounded px-4 py-2 text-sm font-medium text-carbon transition-[background-color,color] duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] hover:bg-ash";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] ${
        scrolled
          ? "border-cloud bg-[rgba(255,255,255,0.92)] backdrop-blur-md"
          : "bg-frost backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1384px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-[17px] font-medium tracking-tight text-carbon transition-colors duration-[330ms] hover:text-graphite"
        >
          JH의 AI 뿌시기
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="주요 메뉴"
        >
          <Link href="/" className={navLinkClass}>
            홈
          </Link>
          <Link href="/blog" className={navLinkClass}>
            블로그
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-5 bg-carbon transition-transform duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-carbon transition-opacity duration-[330ms] ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-carbon transition-transform duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)] ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-14 z-40 bg-white md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="모바일 메뉴"
        >
          <nav className="flex flex-col border-t border-cloud p-4">
            <Link
              href="/"
              className="rounded px-4 py-3 text-sm font-medium text-carbon hover:bg-ash"
              onClick={() => setMenuOpen(false)}
            >
              홈
            </Link>
            <Link
              href="/blog"
              className="rounded px-4 py-3 text-sm font-medium text-carbon hover:bg-ash"
              onClick={() => setMenuOpen(false)}
            >
              블로그
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
