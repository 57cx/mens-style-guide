import fs from "node:fs";
import path from "node:path";
import { CORE_SCHEMA, load as parseYaml } from "js-yaml";
import {
  GARMENT_TYPES,
  compareSvg,
  garment,
  lessonFlatlay,
  paletteSvg,
  proportionSvg,
  renderBoard,
  svgDoc,
} from "./draw.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const catalogPath = path.join(root, "src/_data/outfits.yml");
const outfitDir = path.join(root, "src/assets/images/outfits");
const articleDir = path.join(root, "src/articles/day-01-proportion");

fs.mkdirSync(outfitDir, { recursive: true });
fs.mkdirSync(articleDir, { recursive: true });

fs.writeFileSync(path.join(articleDir, "proportion.svg"), proportionSvg());
fs.writeFileSync(path.join(articleDir, "compare.svg"), compareSvg());
fs.writeFileSync(path.join(articleDir, "palette.svg"), paletteSvg());
fs.writeFileSync(path.join(articleDir, "flatlay.svg"), lessonFlatlay());

if (fs.existsSync(catalogPath)) {
  const outfits = parseYaml(fs.readFileSync(catalogPath, "utf8"), { schema: CORE_SCHEMA }) || [];
  for (const outfit of outfits) {
    if (!outfit.image || !String(outfit.image).endsWith(".svg")) continue;
    const file = path.join(root, "src", outfit.image.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const svg = renderBoard(outfit.items, { title: outfit.title });
    fs.writeFileSync(file, svg);
  }
  console.log(`drew ${outfits.length} outfit boards`);
} else {
  console.log("no outfits.yml yet, skipped boards");
}

console.log("drew day 1 figures");

if (process.argv.includes("--sheet")) {
  const items = GARMENT_TYPES.map((type) => ({
    type,
    name: type,
    color: type.includes("jean") || type.includes("denim") ? "靛蓝" : "藏青",
    fit: type,
  }));
  const sheets = [];
  for (let i = 0; i < items.length; i += 4) {
    sheets.push(renderBoard(items.slice(i, i + 4), { title: "sheet" }));
  }
  const out = "/tmp/garment-sheets";
  fs.mkdirSync(out, { recursive: true });
  sheets.forEach((svg, i) => fs.writeFileSync(path.join(out, `sheet-${i}.svg`), svg));
  fs.writeFileSync(path.join(out, "proportion.svg"), proportionSvg());
  fs.writeFileSync(path.join(out, "compare.svg"), compareSvg());
  fs.writeFileSync(path.join(out, "palette.svg"), paletteSvg());
  fs.writeFileSync(path.join(out, "flatlay.svg"), lessonFlatlay());
  console.log("sheets in", out);
}

export { svgDoc, garment };
