/**
 * PPTX 슬라이드에 연결된 이미지를 public/blog-assets/... 로 복사합니다.
 * (정적 블로그에서 /blog-assets/... 로 제공)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PPTX = path.join(ROOT, "Global_Compressor_Strategic_Roadmap.pptx");
const OUT_DIR = path.join(
  ROOT,
  "public",
  "blog-assets",
  "global-compressor-roadmap",
);

function parseRelationships(xml) {
  const map = new Map();
  for (const match of xml.matchAll(/<Relationship[^>]+>/g)) {
    const tag = match[0];
    const idM = /Id="(rId\d+)"/.exec(tag);
    const tgtM = /Target="([^"]+)"/.exec(tag);
    if (idM && tgtM) map.set(idM[1], tgtM[1]);
  }
  return map;
}

function relsTargetToZipPath(target) {
  return path.posix.normalize(path.posix.join("ppt/slides", target));
}

function getSlideNumbers(zip) {
  const nums = [];
  for (const e of zip.getEntries()) {
    const m = e.entryName.match(/^ppt\/slides\/slide(\d+)\.xml$/i);
    if (m) nums.push(parseInt(m[1], 10));
  }
  return [...new Set(nums)].sort((a, b) => a - b);
}

function collectEmbedRids(slideXml) {
  const rids = [];
  const re = /r:embed="(rId\d+)"/g;
  let m;
  while ((m = re.exec(slideXml)) !== null) {
    rids.push(m[1]);
  }
  return rids;
}

function main() {
  if (!fs.existsSync(PPTX)) {
    console.error("PPTX not found:", PPTX);
    process.exit(1);
  }

  const zip = new AdmZip(PPTX);
  const slideNums = getSlideNumbers(zip);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const n of slideNums) {
    const slidePath = `ppt/slides/slide${n}.xml`;
    const relsPath = `ppt/slides/_rels/slide${n}.xml.rels`;
    const slideEnt = zip.getEntry(slidePath);
    const relsEnt = zip.getEntry(relsPath);
    if (!slideEnt) continue;

    const slideXml = slideEnt.getData().toString("utf8");
    const relMap = relsEnt
      ? parseRelationships(relsEnt.getData().toString("utf8"))
      : new Map();

    let mediaZipPath = null;
    for (const rid of collectEmbedRids(slideXml)) {
      const target = relMap.get(rid);
      if (!target || !/media\//i.test(target)) continue;
      mediaZipPath = relsTargetToZipPath(target);
      break;
    }

    if (!mediaZipPath) {
      console.warn("No media for slide", n);
      continue;
    }

    const imgEnt = zip.getEntry(mediaZipPath);
    if (!imgEnt) {
      console.warn("Missing zip entry", mediaZipPath);
      continue;
    }

    const base = path.posix.basename(mediaZipPath);
    const ext = path.posix.extname(base) || ".png";
    const destName = `slide-${String(n).padStart(2, "0")}${ext}`;
    const dest = path.join(OUT_DIR, destName);
    fs.writeFileSync(dest, imgEnt.getData());
    console.log(n, "->", destName);
  }
}

main();
