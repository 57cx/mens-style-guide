// 把 photos/ 里的实拍图（AI 生成或真实照片）放到构建要用的位置：
//   photos/outfits/*          → src/assets/outfits/      搭配的平铺图和上身图
//   photos/wardrobe/*         → src/assets/wardrobe/     衣橱单品图
//   photos/articles/<文章id>/* → src/articles/<文章id>/   文章配图和重点速览视频（正文里写 ./文件名）
//                                                    视频：recap.mp4(.b64) + 封面 recap-poster.jpg(.b64)
// 支持两种存法：直接放 .jpg/.png/.webp/.mp4，或放 base64 文本 <文件名>.b64（只能提交文本时用）。
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const IMAGE = /\.(jpe?g|png|webp)$/i;
const VIDEO = /\.(mp4|webm)$/i;
const MEDIA = (name) => IMAGE.test(name) || VIDEO.test(name);

function copyFolder(from, to) {
  if (!fs.existsSync(from)) return 0;
  fs.mkdirSync(to, { recursive: true });
  let count = 0;
  for (const file of fs.readdirSync(from)) {
    const src = path.join(from, file);
    if (fs.statSync(src).isDirectory()) continue;
    if (file.endsWith(".b64")) {
      const name = file.slice(0, -4);
      if (!MEDIA(name)) continue;
      const data = Buffer.from(fs.readFileSync(src, "utf8").replace(/\s+/g, ""), "base64");
      fs.writeFileSync(path.join(to, name), data);
      count += 1;
    } else if (MEDIA(file)) {
      fs.copyFileSync(src, path.join(to, file));
      count += 1;
    }
  }
  return count;
}

const outfits = copyFolder(path.join(root, "photos", "outfits"), path.join(root, "src", "assets", "outfits"));
const wardrobe = copyFolder(path.join(root, "photos", "wardrobe"), path.join(root, "src", "assets", "wardrobe"));
let articles = 0;
const articleRoot = path.join(root, "photos", "articles");
if (fs.existsSync(articleRoot)) {
  for (const entry of fs.readdirSync(articleRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    articles += copyFolder(path.join(articleRoot, entry.name), path.join(root, "src", "articles", entry.name));
  }
}
console.log(`实拍图：搭配 ${outfits} 张，衣橱单品 ${wardrobe} 张，文章配图和视频 ${articles} 个`);
