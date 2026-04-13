import AdmZip from "adm-zip";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zip = new AdmZip(path.join(__dirname, "..", "Global_Compressor_Strategic_Roadmap.pptx"));
const names = zip
  .getEntries()
  .map((e) => e.entryName)
  .filter(
    (n) =>
      n.includes("notes") ||
      n.includes("comment") ||
      n.includes("slideMaster") ||
      n.match(/ppt\/slides\/slide\d+\.xml$/),
  );
console.log(names.sort().join("\n"));
