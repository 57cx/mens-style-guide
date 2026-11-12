import fs from "node:fs";
import path from "node:path";
import { dump } from "js-yaml";

const MAX_BYTES = 8 * 1024 * 1024;

export function parseSubmission(body) {
  const normalized = String(body || "").replaceAll("\r\n", "\n");
  const sections = {};
  for (const part of normalized.split(/^### /m).slice(1)) {
    const [titleLine, ...rest] = part.split("\n");
    sections[titleLine.trim()] = rest.join("\n").trim();
  }
  const items = (sections["单品"] || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, color, fit] = line.split("|").map((part) => (part || "").trim());
      return name ? { name, color: color || "", fit: fit || "" } : null;
    })
    .filter(Boolean);
  const images = [];
  const source = sections["照片"] || normalized;
  for (const match of source.matchAll(/!\[[^\]]*\]\((https:\/\/[^)\s]+)\)/g)) {
    if (allowedImage(match[1])) images.push(match[1]);
  }
  return {
    scene: oneLine(sections["场景"]),
    style: oneLine(sections["风格"]),
    season: oneLine(sections["季节"]),
    colors: (sections["颜色"] || "").split(/[、,，\s]+/).map((item) => item.trim()).filter(Boolean),
    items,
    why: (sections["为什么适合"] || "").trim(),
    images: images.slice(0, 4),
  };
}

function oneLine(value) {
  return String(value || "").split("\n").map((line) => line.trim()).find(Boolean) || "";
}

export function allowedImage(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname;
    return host === "github.com" || host.endsWith(".github.com") || host.endsWith(".githubusercontent.com");
  } catch {
    return false;
  }
}

async function download(url) {
  if (!allowedImage(url)) throw new Error(`不接受的图片地址：${url}`);
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`图片下载失败 ${response.status}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error("链接不是图片");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_BYTES) throw new Error("图片超过 8MB");
  const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("gif") ? "gif" : "jpg";
  return { bytes, ext };
}

async function main() {
  const body = process.env.ISSUE_BODY || "";
  const number = process.env.ISSUE_NUMBER;
  const title = (process.env.ISSUE_TITLE || "").replace(/^搭配[:：]\s*/, "").trim();
  if (!body.includes("### 场景")) {
    console.log(JSON.stringify({ ok: false, skip: true, message: "不是「提交搭配」表单，跳过。" }));
    return;
  }
  const parsed = parseSubmission(body);
  if (!number) throw new Error("缺少议题编号");
  if (!parsed.scene || !parsed.items.length || !parsed.why) {
    throw new Error("场景、单品和「为什么适合」都要填。单品一行一件，用竖线分开：单品 | 颜色 | 版型");
  }
  if (!parsed.images.length) {
    throw new Error("没有在「照片」栏里看到 GitHub 图片。请把照片拖进那个输入框，不要只写外链。");
  }
  const id = `issue-${number}`;
  const folder = path.join("src", "outfits", id);
  fs.mkdirSync(folder, { recursive: true });
  const photos = [];
  for (let index = 0; index < parsed.images.length; index += 1) {
    const file = await download(parsed.images[index]);
    const name = `photo-${index + 1}.${file.ext}`;
    fs.writeFileSync(path.join(folder, name), file.bytes);
    photos.push(name);
  }
  const outfit = {
    id,
    title: title || `${parsed.scene}搭配`,
    scene: parsed.scene,
    style: parsed.style,
    season: parsed.season,
    colors: parsed.colors,
    why: parsed.why,
    source: `读者经 GitHub 议题 #${number} 提交`,
    image: photos[0],
    items: parsed.items,
  };
  fs.writeFileSync(path.join(folder, "outfit.yml"), dump(outfit, { lineWidth: 88 }));
  console.log(JSON.stringify({ ok: true, id, folder, photos }));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  main().catch((error) => {
    console.log(JSON.stringify({ ok: false, message: error.message || String(error) }));
    process.exitCode = 1;
  });
}
