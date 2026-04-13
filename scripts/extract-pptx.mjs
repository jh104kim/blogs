import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DEFAULT_PPTX = path.join(ROOT, "Global_Compressor_Strategic_Roadmap.pptx");
const OUT_TOPIC = "global-compressor-roadmap";
const OUT_FILE = "20260413_global-compressor-strategic-roadmap.md";

function slideSortKey(name) {
  const m = name.match(/slide(\d+)\.xml$/i);
  return m ? parseInt(m[1], 10) : 0;
}

function extractAText(xml) {
  const re = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
  const parts = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    const t = m[1]
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    if (t) parts.push(t);
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function main() {
  const pptxPath = path.resolve(process.argv[2] || DEFAULT_PPTX);
  if (!fs.existsSync(pptxPath)) {
    console.error("PPTX not found:", pptxPath);
    process.exit(1);
  }

  const zip = new AdmZip(pptxPath);
  const slides = zip
    .getEntries()
    .filter((e) => !e.isDirectory && /^ppt\/slides\/slide\d+\.xml$/i.test(e.entryName))
    .sort((a, b) => slideSortKey(a.entryName) - slideSortKey(b.entryName));

  if (slides.length === 0) {
    console.error("No ppt/slides/slide*.xml entries found in", pptxPath);
    process.exit(1);
  }

  const sections = [];
  for (let i = 0; i < slides.length; i++) {
    const ent = slides[i];
    const xml = ent.getData().toString("utf8");
    const text = extractAText(xml);
    sections.push(
      `## Slide ${i + 1}\n\n${text || "_(이 슬라이드에서 추출된 텍스트가 없습니다)_"}`,
    );
  }

  const body = sections.join("\n\n");

  const frontmatter = `---
title: "글로벌 압축기 전략 로드맵"
date: "2026-04-13"
description: "PPTX에서 추출한 슬라이드 텍스트 초안"
tags:
  - compressor
  - strategy
  - pptx-import
---
`;

  const outDir = path.join(ROOT, "content", OUT_TOPIC);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, OUT_FILE);
  fs.writeFileSync(outPath, `${frontmatter}\n${body}\n`, "utf8");
  console.log("Wrote", path.relative(ROOT, outPath));
}

main();
