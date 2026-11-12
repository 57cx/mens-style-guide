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

正文汉字（不含标点和标记）**2000 到 3500**，大约读 5 到 10 分钟。`npm run check` 会数。

## 文章结构

四个二级标题必须原文出现，顺序不变：

1. `## 一句话结论`  
   紧跟着一段 `<p class="conclusion">`，把今天的判断说完。
2. `## 图解原理`  
   配图，把比例、颜色或步骤讲清楚。
3. `## 对与错`  
   至少一组错、一组对。要写明为什么不适合或适合 **这位** 181/72、黄皮的读者，不要只说「不好看」。
4. `## 照着买、照着穿`  
   具体到单品、颜色、版型或尺码试法、价位（平价 / 中档 / 进阶）。品牌只作版型参考，写明合身比标志重要。

价位大致按外套计：平价大约一两百到六百，中档大约七百到两千，进阶两千以上。

购买清单用下面的结构，手机上比表格好读：

```html
<div class="look">
  <h3>搭配一：场合</h3>
  <p>为什么这套适合 181/72、黄皮。</p>
  <div class="buy-grid">
    <article class="buy">
      <h4>单品名</h4>
      <dl>
        <dt>颜色</dt><dd>藏青</dd>
        <dt>版型</dt><dd>过臀，肩缝在肩骨上。从 180 码起试。</dd>
        <dt>价位</dt><dd>中档。可参考的品牌和一句理由。</dd>
      </dl>
    </article>
  </div>
</div>
```

## 图

每篇至少 **3** 张。优先自己画的 SVG，放在文章文件夹里，信息要能看懂：标注、对比、色块或平铺，不要空盒子。

```html
<figure>
  <img src="./proportion.svg" alt="用一句话说明这张图在比什么">
  <figcaption>图：本站自绘 SVG。再用半句点明该看哪里。</figcaption>
</figure>
```

图注以 `图：` 开头。

- 自己画的：`图：本站自绘 SVG。`
- 可商用的现成图：写作者、许可名称，例如 `图：作者名，Unsplash License。`

不要用来路不明的图，不要用带商标的抄画。构建脚本 `scripts/draw.mjs` 能画平铺单品；文章里的原理图可以继续用 SVG 手画，或沿用这套画法。

文章里的图片路径用 `./文件名`，这样在仓库子路径下也能打开。

## 文件

```text
src/articles/day-02-sizes.md
src/articles/day-02-sizes/肩线.svg
src/articles/day-02-sizes/对比.svg
```

文件名用 `curriculum.yml` 里的 `id`，不要另起一个。Front matter：

```yaml
title: 和课表一致的标题
date: 2026-11-13
day: 2
minutes: 8
section: 基础原理
styles: []
scenes: []
seasons: [秋冬]
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
  items:
    - type: overcoat
      name: 羊毛大衣
      color: 藏青
      fit: 过臀，肩缝在肩骨
```

`type` 决定平铺图，只能用这些：`overcoat`、`blazer`、`jacket`、`rider`、`denim-jacket`、`field-jacket`、`down-jacket`、`vest`、`sweater-vest`、`shirt`、`flannel`、`turtleneck`、`crewneck`、`hoodie`、`tee`、`fleece`、`trousers`、`jeans`、`chinos`、`sweatpants`、`chelsea`、`sneaker`、`oxford`、`boot`、`loafer`、`tie`。

`npm run check` 会按这份清单重画 SVG。

真实照片不要写进总表，改用文件夹：

```text
src/outfits/my-friday/outfit.yml
src/outfits/my-friday/photo.jpg
```

`source` 写清楚是谁的照片。`image` 写文件名。这种文件夹给「上传搭配」导出的 JSON（`npm run import-outfit`）和议题 Action 使用。

示例单品在 `src/_data/wardrobe.yml`。那是示例时保持 `status: example`，页面会标明。换成本人衣服后改掉这个状态，并删掉文案里的「示例」。

## 交稿前

```bash
npm run check
```

不过就不要推。检查包括：三十天不重复、顺序是基础再到细节、秋冬场景课在第 18 到 22 天、汉字数量、四个标题、至少三张带「图：」的图、搭配字段和单品类型。
