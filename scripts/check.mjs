import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { CORE_SCHEMA, load as parseYaml } from "js-yaml";
import { GARMENT_TYPES } from "./draw.mjs";
import { parseSubmission } from "./publish-outfit-from-issue.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const errors = [];
const fail = (message) => errors.push(message);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const load = (file) => parseYaml(read(file), { schema: CORE_SCHEMA });

const SECTION_ORDER = ["基础原理", "配色", "风格专题", "场景穿搭", "衣橱建设", "细节"];
const SEASONS = new Set(["春", "夏", "秋", "冬", "秋冬", "春夏"]);

const curriculum = load("curriculum.yml");
const taxonomies = load("src/_data/taxonomies.yml");
const outfits = load("src/_data/outfits.yml");
const wardrobe = load("src/_data/wardrobe.yml");

const sectionNames = new Set(taxonomies.sections.map((item) => item.name));
const styleNames = new Set(taxonomies.styles.map((item) => item.name));
const sceneNames = new Set(taxonomies.scenes.map((item) => item.name));

if (curriculum.reader.height_cm !== 181 || curriculum.reader.weight_kg !== 72) {
  fail("读者档案必须是 181cm、72kg");
}
if (!String(curriculum.reader.skin).includes("黄")) fail("读者档案要写明偏黄肤色");
if (!Array.isArray(curriculum.days) || curriculum.days.length !== 30) fail("课表必须正好 30 天");

const days = curriculum.days || [];
const seenDay = new Set();
const seenId = new Set();
const seenTitle = new Set();
let sectionCursor = 0;
days.forEach((day, index) => {
  if (day.day !== index + 1) fail(`第 ${index + 1} 条的 day 不是 ${index + 1}`);
  if (seenDay.has(day.day)) fail(`day 重复：${day.day}`);
  seenDay.add(day.day);
  if (seenId.has(day.id)) fail(`id 重复：${day.id}`);
  seenId.add(day.id);
  if (seenTitle.has(day.title)) fail(`标题重复：${day.title}`);
  seenTitle.add(day.title);
  if (!sectionNames.has(day.section)) fail(`第 ${day.day} 天板块不在目录里：${day.section}`);
  const sectionIndex = SECTION_ORDER.indexOf(day.section);
  if (sectionIndex < sectionCursor) fail(`第 ${day.day} 天的板块顺序回退了`);
  sectionCursor = Math.max(sectionCursor, sectionIndex);
  for (const name of day.styles || []) if (!styleNames.has(name)) fail(`第 ${day.day} 天未知风格 ${name}`);
  for (const name of day.scenes || []) if (!sceneNames.has(name)) fail(`第 ${day.day} 天未知场景 ${name}`);
  for (const name of day.seasons || []) if (!SEASONS.has(name)) fail(`第 ${day.day} 天未知季节 ${name}`);
  if (!day.outline || !String(day.outline).trim()) fail(`第 ${day.day} 天缺少 outline`);
  if (!["published", "planned"].includes(day.status)) fail(`第 ${day.day} 天 status 非法`);
});

const next = days.find((day) => day.status !== "published");
if ((next ? next.day : null) !== curriculum.next_day) {
  fail(`next_day 应为 ${next ? next.day : null}，现在是 ${curriculum.next_day}`);
}
for (const day of days.filter((item) => item.day >= 18 && item.day <= 22)) {
  if (!(day.seasons || []).includes("秋冬")) fail(`第 ${day.day} 天应先写秋冬`);
  if (!(day.scenes || []).length) fail(`第 ${day.day} 天应带场景`);
}

if (wardrobe.status !== "example") fail("示例衣橱必须标成 example，换成真衣服后再改");
if (!String(wardrobe.note || "").includes("示例")) fail("衣橱说明里要写明这是示例");
if (!wardrobe.pieces || wardrobe.pieces.length < 8) fail("示例衣橱至少 8 件");
for (const piece of wardrobe.pieces || []) {
  // 单品图可选；写了就必须在 photos/wardrobe/ 里有对应文件
  if (!piece.image) continue;
  if (!String(piece.image).startsWith("/assets/wardrobe/")) fail(`${piece.id} 的 image 要放在 /assets/wardrobe/`);
  const plainPiece = path.join(root, "photos", "wardrobe", path.basename(piece.image));
  if (![plainPiece, `${plainPiece}.b64`].some((f) => fs.existsSync(f) && fs.statSync(f).size > 2000)) {
    fail(`缺少单品图 photos/wardrobe/${path.basename(piece.image)}（或 .b64）`);
  }
}

if (!Array.isArray(outfits) || outfits.length < 20) fail("推荐搭配至少 20 套");
const outfitIds = new Set();
for (const outfit of outfits) {
  if (outfitIds.has(outfit.id)) fail(`搭配 id 重复：${outfit.id}`);
  outfitIds.add(outfit.id);
  for (const key of ["title", "scene", "style", "season", "why", "image", "source"]) {
    if (!outfit[key]) fail(`${outfit.id} 缺少 ${key}`);
  }
  if (!sceneNames.has(outfit.scene)) fail(`${outfit.id} 场景不对`);
  if (!styleNames.has(outfit.style)) fail(`${outfit.id} 风格不对`);
  if (!SEASONS.has(outfit.season)) fail(`${outfit.id} 季节不对`);
  if (!String(outfit.why).includes("181") || !String(outfit.why).includes("黄")) {
    fail(`${outfit.id} 的 why 要同时提到 181 和黄皮`);
  }
  if (!outfit.items || outfit.items.length < 3) fail(`${outfit.id} 至少 3 件单品`);
  for (const item of outfit.items || []) {
    if (!item.name || !item.color || !item.fit) fail(`${outfit.id} 的单品缺名称、颜色或版型`);
    if (!GARMENT_TYPES.includes(item.type)) fail(`${outfit.id} 未知 type：${item.type}`);
  }
  if (outfit.source !== "本站自绘 SVG") fail(`${outfit.id} 的推荐图要注明本站自绘 SVG`);
}

const sample = parseSubmission(`### 场景\n\n上班\n\n### 风格\n\n极简\n\n### 季节\n\n秋冬\n\n### 颜色\n\n藏青、燕麦\n\n### 单品\n\n大衣 | 藏青 | 过臀\n\n### 为什么适合\n\n181 要过臀，黄皮用燕麦。\n\n### 照片\n\n![a](https://github.com/user-attachments/assets/demo.png)\n![b](http://169.254.169.254/latest)\n`);
if (sample.scene !== "上班" || sample.items.length !== 1) fail("议题解析失败");
if (sample.images.length !== 1) fail("议题图片应只收下 GitHub 图片链接");

if (errors.length) {
  console.error(errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

for (const script of ["scripts/prepare-photos.mjs", "scripts/generate-svgs.mjs"]) {
  const run = spawnSync(process.execPath, [script], { cwd: root, stdio: "inherit" });
  if (run.status !== 0) process.exit(run.status || 1);
}
const warnings = [];

for (const outfit of outfits) {
  const file = path.join(root, "src", outfit.image.replace(/^\//, ""));
  if (!fs.existsSync(file) || fs.statSync(file).size < 200) fail(`缺少搭配图 ${outfit.image}`);
  // 实拍图（可选，但要成对）：photos/outfits/ 下放 .jpg 或 .jpg.b64
  if (outfit.photo_flat || outfit.photo_look) {
    if (!outfit.photo_flat || !outfit.photo_look) fail(`${outfit.id} 的平铺图和上身图要成对`);
    if (!outfit.photo_credit) fail(`${outfit.id} 有实拍图但缺 photo_credit`);
    for (const key of ["photo_flat", "photo_look"]) {
      const url = outfit[key];
      if (!url) continue;
      if (!url.startsWith("/assets/outfits/")) fail(`${outfit.id} 的 ${key} 要放在 /assets/outfits/`);
      const name = path.basename(url);
      const plain = path.join(root, "photos", "outfits", name);
      const encoded = `${plain}.b64`;
      const ok = [plain, encoded].some((f) => fs.existsSync(f) && fs.statSync(f).size > 2000);
      if (!ok) fail(`缺少实拍图 photos/outfits/${name}（或 ${name}.b64）`);
    }
  }
}

for (const day of days.filter((item) => item.status === "published")) {
  const articlePath = path.join(root, "src/articles", `${day.id}.md`);
  if (!fs.existsSync(articlePath)) {
    fail(`已发布的第 ${day.day} 天没有文章 ${day.id}.md`);
    continue;
  }
  const raw = fs.readFileSync(articlePath, "utf8");
  const body = raw.replace(/^---[\s\S]*?---/, "");
  for (const heading of ["## 一句话结论", "## 图解原理", "## 对与错", "## 照着买、照着穿"]) {
    if (!body.includes(heading)) fail(`${day.id} 缺少标题 ${heading}`);
  }
  const figures = body.match(/<figure>[\s\S]*?<\/figure>/g) || [];
  const captions = body.match(/<figcaption>[\s\S]*?<\/figcaption>/g) || [];
  if (figures.length < 3) fail(`${day.id} 至少 3 张图`);
  if (captions.length < figures.length) fail(`${day.id} 每张图都要有图注`);
  if (captions.some((caption) => !caption.includes("图："))) fail(`${day.id} 的图注要以「图：」写出来源`);
  const photos = [...body.matchAll(/src="\.\/([^"]+\.(?:jpe?g|png|webp))"/gi)];
  // 写作规范要求每篇至少 6 张写实图；不够只提醒，不挡发布（每日自动发文可能出不了图）
  if (photos.length < 6) warnings.push(`${day.id} 只有 ${photos.length} 张写实图，规范要求至少 6 张`);
  const plain = body.replace(/<[^>]+>/g, "");
  const han = plain.match(/[\u4e00-\u9fff]/g) || [];
  const chars = [...plain.replace(/\s+/g, "")].length;
  console.log(`${day.id} 正文 ${chars} 字（汉字 ${han.length}），图 ${figures.length} 张，其中写实图 ${photos.length} 张`);
  if (han.length < 600 || han.length > 1800) fail(`${day.id} 汉字 ${han.length}，需要 600 到 1800（全文约 3000 字以内，图为主）`);
  if (raw.length > 4500) fail(`${day.id} 源文件 ${raw.length} 字符，超过 4500，文字太多了`);
  for (const match of body.matchAll(/src="\.\/([^"]+)"/g)) {
    if (!fs.existsSync(path.join(root, "src/articles", day.id, match[1]))) fail(`${day.id} 缺少图片 ${match[1]}`);
  }
}

if (errors.length) {
  console.error(errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
for (const warning of warnings) console.warn(`提醒：${warning}`);
console.log(`课表 ${days.length} 天，下一篇是第 ${curriculum.next_day} 天；推荐搭配 ${outfits.length} 套。`);
