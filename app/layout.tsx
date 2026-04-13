import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JH의 AI 뿌시기",
    template: "%s · JH의 AI 뿌시기",
  },
  description:
    "바이브 설계도 · Vibe Coding과 시스템 아키텍처—프롬프트·에이전트·하네스 엔지니어링 실전 글.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background font-sans text-graphite">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
