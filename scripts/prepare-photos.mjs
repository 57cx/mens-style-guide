// 把 photos/outfits/ 里的搭配实拍图放到 src/assets/outfits/，构建时再原样发布。
// 支持两种存法：直接放 .jpg/.png/.webp，或放 base64 文本 <文件名>.b64（只能提交文本时用）。
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const from = path.join(root, "photos", "outfits");
const to = path.join(root, "src", "assets", "outfits");
const IMAGE = /\.(jpe?g|png|webp)$/i;

fs.mkdirSync(to, { recursive: true });
let count = 0;
if (fs.existsSync(from)) {
  for (const file of fs.readdirSync(from)) {
    const src = path.join(from, file);
    if (file.endsWith(".b64")) {
      const name = file.slice(0, -4);
      if (!IMAGE.test(name)) continue;
      const data = Buffer.from(fs.readFileSync(src, "utf8").replace(/\s+/g, ""), "base64");
      fs.writeFileSync(path.join(to, name), data);
      count += 1;
    } else if (IMAGE.test(file)) {
      fs.copyFileSync(src, path.join(to, file));
      count += 1;
    }
  }
}
console.log(`搭配实拍图 ${count} 张 → src/assets/outfits/`);
