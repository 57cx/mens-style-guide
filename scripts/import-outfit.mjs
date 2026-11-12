import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { dump } from "js-yaml";

const file = process.argv[2];
if (!file) {
  console.error("用法：npm run import-outfit -- 导出的文件.json");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(file, "utf8"));
const outfits = Array.isArray(raw) ? raw : raw.outfits;
if (!Array.isArray(outfits) || !outfits.length) {
  console.error("文件里没有 outfits。请从网站的「上传搭配」页导出。");
  process.exit(1);
}

for (const outfit of outfits) {
  const id = slug(outfit);
  const folder = path.join("src", "outfits", id);
  fs.mkdirSync(folder, { recursive: true });
  const photos = [];
  (outfit.photos || []).slice(0, 4).forEach((photo, index) => {
    const match = String(photo).match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/);
    if (!match) return;
    const ext = match[1] === "jpeg" ? "jpg" : match[1];
    const name = `photo-${index + 1}.${ext}`;
    fs.writeFileSync(path.join(folder, name), Buffer.from(match[2], "base64"));
    photos.push(name);
  });
  if (!photos.length) {
    console.error(`${id} 没有照片，跳过`);
    continue;
  }
  const data = {
    id,
    title: outfit.title || id,
    scene: outfit.scene || "",
    style: outfit.style || "",
    season: outfit.season || "",
    colors: outfit.colors || [],
    why: outfit.why || "",
    source: "读者上传后收入站点",
    image: photos[0],
    items: (outfit.items || []).map((item) => ({
      name: item.name || "",
      color: item.color || "",
      fit: item.fit || "",
    })),
  };
  fs.writeFileSync(path.join(folder, "outfit.yml"), dump(data, { lineWidth: 88 }));
  console.log(`写入 src/outfits/${id}/`);
}

function slug(outfit) {
  const base = String(outfit.id || outfit.title || "look").toLowerCase();
  const ascii = base.replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
  if (ascii.length >= 3) return ascii;
  const hash = crypto.createHash("sha1").update(JSON.stringify(outfit.title || "")).digest("hex").slice(0, 8);
  return `upload-${hash}`;
}
