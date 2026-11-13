import fs from "node:fs";
import path from "node:path";
import { CORE_SCHEMA, load as parseYaml } from "js-yaml";

const MEDIA = /\.(svg|png|jpe?g|webp|gif)$/i;

function loadYaml(file) {
  return parseYaml(fs.readFileSync(file, "utf8"), { schema: CORE_SCHEMA }) || [];
}

function firstImage(folder) {
  if (!fs.existsSync(folder)) return null;
  return fs.readdirSync(folder).find((file) => MEDIA.test(file)) || null;
}

function readUserOutfit(folder, id) {
  const ymlPath = path.join(folder, "outfit.yml");
  if (!fs.existsSync(ymlPath)) return null;
  const data = parseYaml(fs.readFileSync(ymlPath, "utf8"), { schema: CORE_SCHEMA }) || {};
  const imageFile = data.image || firstImage(folder);
  return {
    ...data,
    id: data.id || id,
    origin: "user",
    source: data.source || "读者上传",
    image: imageFile ? `/media/outfits/${id}/${path.basename(imageFile)}` : "",
    photos: fs
      .readdirSync(folder)
      .filter((file) => MEDIA.test(file))
      .map((file) => `/media/outfits/${id}/${file}`),
  };
}

export default function () {
  const seedPath = path.join("src", "_data", "outfits.yml");
  const seed = (fs.existsSync(seedPath) ? loadYaml(seedPath) : []).map((outfit) => ({
    ...outfit,
    origin: "recommended",
    source: outfit.photo_flat ? outfit.photo_credit || "AI 生成，本站自制" : outfit.source || "本站自绘 SVG",
    cover: outfit.photo_flat || outfit.image,
    photos: outfit.photo_flat
      ? [outfit.photo_flat, outfit.photo_look].filter(Boolean)
      : outfit.image
        ? [outfit.image]
        : [],
  }));

  const userRoot = path.join("src", "outfits");
  const user = [];
  if (fs.existsSync(userRoot)) {
    for (const entry of fs.readdirSync(userRoot, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const outfit = readUserOutfit(path.join(userRoot, entry.name), entry.name);
      if (outfit) user.push(outfit);
    }
  }

  const all = [...seed, ...user];
  const colors = [...new Set(all.flatMap((outfit) => outfit.colors || []))].sort();
  return { seed, user, all, colors };
}
