# 写作规范

每天一篇，读者始终是同一个人。不要写成通用男装杂志。

## 读者

- 身高 181cm，体重 72kg。偏高偏瘦，衣架子。体质指数大约 22，看着薄，是因为身高把重量摊开了，不是因为该买大一号。
- 肤色偏黄，暖调或中性调。
- 靠近脸优先：藏青、燕麦、卡其、橄榄绿（要偏棕，不要发灰）、酒红、奶白。
- 慎用：荧光色、亮黄、发灰的黄绿。这些颜色会把脸衬脏或衬青。
- 空的是厚度和长度。肩缝落在肩骨上，再谈宽松。衣摆至少过臀。裤管留空气，不要用紧身裤「显瘦」。

## 语气和篇幅

大白话。用「你」。一句一件事。不写口号，不写穿搭哲学。

**图为主，字为辅。** 读者反馈过「字太多、图太少、看不直观」，所以：

- 全文（含标点）**最多约 3000 字**，正文汉字 **600 到 1800**，读 3 到 5 分钟。`npm run check` 会数，超出就不过。
- 段落短，一段两三句；能列点就列点，每点一件事。
- 先放图，再用一两句话说「看哪里」。能用图讲清的，不再用文字重复。

## 文章结构

四个二级标题必须原文出现，顺序不变：

1. `## 一句话结论`  
   紧跟着一段 `<p class="conclusion">`，把今天的判断说完。  
   结论下面紧跟一段约 30 秒的**重点速览视频**（`<figure class="recap">`，见下一节）。
2. `## 图解原理`  
   一张上身图加标注（绿点 + 中文标签）先讲清要看的部位，下面三四条短列点。
3. `## 对与错`  
   **用写实照片对比**：左「错」右「对」并排成一张图，同一位模特、同一背景，只改一个变量。每组下面两三条列点写为什么，要说清对 **这位** 181/72、黄皮的读者为什么不合适或合适，不要只说「不好看」。
4. `## 照着买、照着穿`  
   每套搭配先放一张**平铺图**（这套的全部单品），下面三四条列点：单品、颜色、版型或尺码试法、价位（平价 / 中档 / 进阶）。品牌只作版型参考，写明合身比标志重要。

价位大致按外套计：平价大约一两百到六百，中档大约七百到两千，进阶两千以上。

购买清单用「平铺图 + 列点」，不要再用长表格：

```html
<figure>
  <img src="./buy-commute.jpg" alt="平铺：藏青羊毛大衣、燕麦高领、卡其直筒裤、棕切尔西靴。">
  <figcaption>图：AI 生成，本站自制。通勤：藏青大衣 + 燕麦高领 + 卡其直筒裤 + 棕切尔西。</figcaption>
</figure>

- 大衣：过臀，从 180 或欧码 50 试起，以肩为准。
- 裤子：直筒，配靴子试长度，不买九分。
```

## 重点速览视频

每篇文章开头（一句话结论下面）都放一段 **约 30 秒** 的重点速览视频，让读者不看正文也能抓住今天的重点。视频不是把文字念一遍，而是**演出来**：错的穿法会让这位 181/72、黄皮的读者显得怎样，换成对的又是什么样。

**结构固定，约 30 秒：**

| 时间 | 画面 | 字幕 |
| --- | --- | --- |
| 0–3 秒 | 标题卡：模糊的藏青底，`第 N 天｜短标题`，下面三个关键词和一句钩子 | 中文，Noto Sans CJK |
| 3–27 秒 | 三个要点，每个要点「错 4 秒 → 对 4 秒」 | 见下 |
| 27–32 秒 | 总结卡「记住这三条」：三行，每行一句规则 + 一句做法，底部一句金色提醒 | |

- 三个要点从本篇「对与错」里挑，每个只改一个变量（长度、肩线、颜色……）。
- **错**：红色细边框、右上角红色「✕ 错」，字幕写「做法：后果」，后果要具体，例如「肩缝滑到胳膊上：人显得薄、塌」，下面一行小字写为什么对这位读者不行。
- **对**：绿色边框、「✓ 对」，字幕写「做法：效果」，小字写怎么试、怎么买。
- 左上角标要点序号和主题，例如「① 肩宽」。
- 半身和特写用底部字幕条；全身照用左侧字幕卡，不要挡住腿和鞋。
- 画面用同一位模特（东亚男性，181cm、72kg、偏瘦，肤色偏黄暖调，黑色短发），参考 `ow-01-look.jpg`；秋冬街景或干净的影棚，自然光。先生成错 / 对两张静帧，再各做成 5 秒的小片段，保证同一张脸、同一个背景；片段里不要有字，字幕最后统一用 ffmpeg 叠上去。
- 不要背景音乐，也不配音（默认静音播放也能看懂）。

**规格：** 16:9、1280×720、H.264（yuv420p，`-movflags +faststart`），不带声音，**每段小于 3MB**（大约 `-crf 27`）。另配一张 16:9 封面 `recap-poster.jpg`，左错右对拼在一起，顶部写标题，小于 100KB，**封面上不画播放按钮**（浏览器自己会画）。

**文件和写法：**

```text
photos/articles/<文章 id>/recap.mp4.b64          # 或直接 recap.mp4
photos/articles/<文章 id>/recap-poster.jpg.b64   # 或直接 recap-poster.jpg
```

构建时 `scripts/prepare-photos.mjs` 把它们解码到 `src/articles/<文章 id>/`（`.mp4` 不进仓库），Eleventy 再复制到文章页旁边。正文里这样写，放在 `<p class="conclusion">` 下面：

```html
<figure class="recap">
  <video controls playsinline preload="metadata" poster="./recap-poster.jpg" src="./recap.mp4" aria-label="第 2 天重点速览：肩缝、袖长、裤长三组错对对比。"></video>
  <figcaption><strong>重点速览</strong> · 视频：AI 生成，本站自制。30 秒看完三处：……</figcaption>
</figure>
```

图注以 `视频：` 写来源。这段视频不算进「至少 3 张图 / 6 张写实图」。`npm run check` 对没有视频的文章只提醒、不挡发布（每日自动发文的云端代理可能没有生视频能力）；写了 `<video>` 就必须有对应的文件。没有视频时在提交说明里写「待补重点速览视频：第 N 天」，之后由能生视频的助手补上。

## 图

每篇 **至少 6 张、最好 6 到 8 张写实图**（照片质感，不用抽象 SVG、线稿或色块示意）。一篇里通常是：

| 位置 | 图 | 怎么做 |
| --- | --- | --- |
| 图解原理 | 1 张上身图 + 标注 | 同一位模特全身照，用绿点和白底中文标签指出肩缝、衣摆、裤脚等 |
| 对与错 | 3 到 4 张「错 / 对」对比图 | 两张写实照片左右并排拼成一张，左上角红色「错」、绿色「对」，底下一句中文说明 |
| 对与错 | 可选：特写或面料图 | 袖口、裤脚、肩线特写；颜色用真实衣服叠放的照片，色名标在衣服下面 |
| 照着买 | 每套 1 张平铺图 | 暖白亚麻布底俯拍，只摆这套的单品 |

模特始终是同一个人：东亚男性，181cm、72kg、偏瘦，肤色偏黄暖调，黑色短发。对比图除了要讲的那一处，其余尽量一样。

图上文字用中文，字体用 Noto Sans CJK（思源黑体）。字体渲染不出来时不要在图上写字，把说明放进图注。

```html
<figure>
  <img src="./compare-coat.jpg" alt="左：短款亮黄羽绒配紧身裤；右：藏青过臀大衣配直筒裤。">
  <figcaption>图：AI 生成，本站自制。左边上身鼓、腿更细；右边从肩到脚一条线。</figcaption>
</figure>
```

图注以 `图：` 开头，每张图都要有图注。

- 自己生成的：`图：AI 生成，本站自制。`
- 可商用的现成图：写作者、许可名称，例如 `图：作者名，Unsplash License。`

不要用来路不明的图，不要用带商标的图。文章里的图片路径用 `./文件名`，这样在仓库子路径下也能打开。

图片源文件放在 `photos/articles/<文章 id>/`，长边约 1200px、每张小于 300KB。能提交二进制就放 `.jpg`；只能提交文本时放 base64 文本 `<文件名>.jpg.b64`。构建时 `scripts/prepare-photos.mjs` 会把它们放进 `src/articles/<文章 id>/`（这个位置的图片不进仓库）。

`npm run check` 对少于 6 张写实图只提醒、不挡发布（每日自动发文有时没有生图能力）；这时先用已有的搭配平铺图、上身图凑足，并在 PR 里写明补图。

## 文件

```text
src/articles/day-02-sizes.md
photos/articles/day-02-sizes/checkpoints.jpg.b64
photos/articles/day-02-sizes/compare-shoulder.jpg.b64
photos/articles/day-02-sizes/recap.mp4.b64
photos/articles/day-02-sizes/recap-poster.jpg.b64
```

文件名用 `curriculum.yml` 里的 `id`，不要另起一个。Front matter：

```yaml
title: 和课表一致的标题
date: 2026-11-13
day: 2
minutes: 4
section: 基础原理
styles: []
scenes: []
seasons: [秋冬]
cover: ./checkpoints.jpg   # 文章列表缩略图，用本篇的一张竖图
summary: 给首页用的两句人话。
```

`section` 只能是：基础原理、配色、风格专题、场景穿搭、衣橱建设、细节。

`styles` 只能是：日系、美式复古、通勤商务休闲、极简、街头、运动机能。

`scenes` 只能是：上班、约会、出游、运动、正式。

`seasons` 用：春、夏、秋、冬、秋冬、春夏。写了「秋冬」的文章会同时出现在秋和冬的列表里。

空着的用 `[]`。名称必须和 `src/_data/taxonomies.yml` 一致，页面才会自动出现，不用改导航。

发布时改课表，不要只丢文件：

```yaml
status: published
published_date: "2026-11-13"
```

并把文件顶部的 `next_day` 改成下一个还是 `planned` 的 `day`。

## 搭配数据

推荐搭配写在 `src/_data/outfits.yml`，一条一块：

```yaml
- id: ow-25
  title: 短标题
  scene: 上班
  style: 极简
  season: 秋冬
  colors: [藏青, 燕麦]
  why: 必须同时出现 181 和黄皮或黄，说明为什么适合这个身材和肤色。
  source: 本站自绘 SVG
  image: /assets/images/outfits/ow-25.svg
  photo_flat: /assets/outfits/ow-25-flat.jpg
  photo_look: /assets/outfits/ow-25-look.jpg
  photo_credit: AI 生成，本站自制
  items:
    - type: overcoat
      name: 羊毛大衣
      color: 藏青
      fit: 过臀，肩缝在肩骨
```

`type` 决定平铺图，只能用这些：`overcoat`、`blazer`、`jacket`、`rider`、`denim-jacket`、`field-jacket`、`down-jacket`、`vest`、`sweater-vest`、`shirt`、`flannel`、`turtleneck`、`crewneck`、`hoodie`、`tee`、`fleece`、`trousers`、`jeans`、`chinos`、`sweatpants`、`chelsea`、`sneaker`、`oxford`、`boot`、`loafer`、`tie`。

`npm run check` 会按这份清单重画 SVG。

### 每套搭配都要两张写实图

从现在起，每一套推荐搭配（包括每天新加的两套）都要配两张写实图，SVG 只是兜底：

1. **平铺图** `photo_flat`：俯拍，暖白亚麻布底，柔和日光，像商品目录。只摆这套里的单品，颜色和名称对上：卡其是浅沙色（不是橄榄棕），燕麦是暖浅米，藏青是深海军蓝，奶白是带暖调的白，驼色、酒红、橄榄绿照字面。不要文字、商标、人。横图 4:3。
2. **上身图** `photo_look`：同一位模特（东亚男性，181cm、72kg、偏瘦，肤色偏黄暖调，黑色短发），从头到鞋全身入镜，自然光，简单街景或公园小路，表情自然，不要文字和商标。竖图 3:4。参考已有的 `ow-01-look.jpg` 保持同一张脸和身形。
3. `photo_credit` 写清来源：自己生成的写 `AI 生成，本站自制`；可商用图库写作者和许可。

文件放在 `photos/outfits/`，命名 `<id>-flat.jpg`、`<id>-look.jpg`，长边约 1200px、每张小于 300KB。能提交二进制就直接放 `.jpg`；只能提交文本时，放同名的 base64 文本 `<id>-flat.jpg.b64`。构建时 `scripts/prepare-photos.mjs` 会把它们放到 `src/assets/outfits/`（这个目录不进仓库）。

`npm run check` 会检查：两张要成对、要有 `photo_credit`、文件在 `photos/outfits/` 里。**没有生图能力时**（例如每日自动更新的云端代理），先不写 `photo_flat` / `photo_look` / `photo_credit` 三个字段，卡片会退回显示 SVG；在提交说明里写明「待补实拍图：ow-xx」，之后由能生图的助手补上。

真实照片不要写进总表，改用文件夹：

```text
src/outfits/my-friday/outfit.yml
src/outfits/my-friday/photo.jpg
```

`source` 写清楚是谁的照片。`image` 写文件名。这种文件夹给「上传搭配」导出的 JSON（`npm run import-outfit`）和议题 Action 使用。

示例单品在 `src/_data/wardrobe.yml`，每件可以带 `image: /assets/wardrobe/<id>.jpg`，图放 `photos/wardrobe/<id>.jpg`（或 `.jpg.b64`），暖白亚麻布底俯拍单件、方图 800px。那是示例时保持 `status: example`，页面会标明。换成本人衣服后改掉这个状态，并删掉文案里的「示例」。

## 交稿前

```bash
npm run check
```

不过就不要推。检查包括：重点速览视频（缺了只提醒）、三十天不重复、顺序是基础再到细节、秋冬场景课在第 18 到 22 天、汉字数量、四个标题、至少三张带「图：」的图、搭配字段和单品类型。
