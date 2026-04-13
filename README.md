This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub Pages (프로젝트 사이트)

저장소 루트의 [`index.html`](./index.html)은 [https://jh104kim.github.io/blogs/](https://jh104kim.github.io/blogs/) 랜딩용입니다.

1. GitHub 저장소 **Settings → Pages**
2. **Build and deployment**: Source **Deploy from a branch**
3. Branch **main**, folder **/ (root)** 저장

`.nojekyll` 파일이 있어 Jekyll 처리를 끕니다. 블로그 전체(글 목록·포스트)를 같은 URL에서 쓰려면 `npm run build`로 생성된 `out/` 내용을 Pages에 맞게 배포하면 됩니다.
