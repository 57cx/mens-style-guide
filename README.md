# 衣架笔记

写给一位读者的男生穿搭课：身高 **181cm**，体重 **72kg**，偏高偏瘦，肤色偏黄。站点是静态的，文章和搭配都从文件生成。推到 `main` 之后，GitHub Actions 会发布到 GitHub Pages。

线上地址：<https://57cx.github.io/mens-style-guide/>

## 技术

[Eleventy](https://www.11ty.dev/) 3。文章是 Markdown，课表、推荐搭配和示例衣橱是 YAML。标签页、首页和课表在构建时自动更新，不用手改导航。

本地预览：

```bash
npm install
npm run dev
```

`npm run dev` 不带仓库前缀，方便在本机打开。正式构建会加上 `/mens-style-guide/`。

检查一篇新文章或一套新搭配是否符合约定：

```bash
npm run check
```

## 加一篇文章

一天一篇，直接进 `main`，不要另开长期分支。

1. 打开根目录的 `curriculum.yml`。`next_day` 是下一篇。也可以看已发布网站上的 `/curriculum.json`，字段 `computed_next_day` 以文件为准、两边必须一致。
2. 新建 `src/articles/<id>.md`。`<id>` 用课表里的 `id`，例如 `src/articles/day-02-sizes.md`。
3. 图片放在同名文件夹：`src/articles/day-02-sizes/图.svg`。文章里用相对路径 `./图.svg`。
4. 写完后把这一天的 `status` 改成 `published`，填上 `published_date`（`YYYY-MM-DD`），把 `next_day` 改成再下一篇。
5. 运行 `npm run check`，通过后提交并推到 `main`。

未写完的稿子放在仓库根目录的 `drafts/`，那里不会被网站读到。

版面、字数、图注和这位读者的身材，见 [WRITING_GUIDE.md](WRITING_GUIDE.md)。

## 加一套推荐搭配

推荐搭配的总表是 `src/_data/outfits.yml`。继续往列表里加一条即可，字段见写作规范。`type` 用来生成平铺图，构建时会写出 `src/assets/images/outfits/<id>.svg`。

每套推荐搭配在卡片上显示两张写实图：左边单品平铺、右边上身效果（字段 `photo_flat`、`photo_look`、`photo_credit`）。图片放在 `photos/outfits/<id>-flat.jpg` 和 `<id>-look.jpg`，也可以用同名 `.jpg.b64` 文本代替；`npm run build` 会先运行 `scripts/prepare-photos.mjs` 把它们放进 `src/assets/outfits/`。没有实拍图的搭配自动显示 SVG。出图要求见 [WRITING_GUIDE.md](WRITING_GUIDE.md) 的「每套搭配都要两张写实图」。

不想改总表时，也可以新建一个文件夹，构建会把它收进衣橱：

```text
src/outfits/my-friday/
  outfit.yml
  photo.jpg
```

`outfit.yml` 里的 `image` 写照片文件名。这种是真实照片，不会被 SVG 脚本覆盖。

## 我的衣橱：上传怎么用

网站没有后端。手机上保存的搭配只在那台设备里。

1. 打开「上传搭配」。
2. 选 1 到 4 张照片，填写标题、场景、风格、季节、颜色和单品，写一句为什么适合 181cm / 72kg / 黄皮。
3. 点保存。照片会先压缩，再放进浏览器的 IndexedDB。
4. 回到「我的衣橱」。这套会出现在推荐搭配旁边，角标是「仅本机」，筛选同样有效。
5. 点「导出 JSON」留下备份。换手机、清缓存或换浏览器之前都要导出。「导入 JSON」可以把备份装回来。

想让所有设备都能打开，把这套收进仓库，三步：

1. 导出 JSON。
2. 在仓库目录运行 `npm run import-outfit -- 你的文件.json`。
3. 把新出现的 `src/outfits/...` 提交并推到 `main`。

只有手机时，打开 [提交搭配](https://github.com/57cx/mens-style-guide/issues/new?template=submit-outfit.yml) 议题，把照片拖进「照片」栏。Action 会尝试把照片和文字写成 `src/outfits/issue-编号/` 并提交到 `main`，同时再发布一次网站。照片必须是拖进去之后的 GitHub 图片，外链不会收。失败的话，议题里会留下原因，仍可以改用上面的 JSON 办法。

「我的单品」现在是一份**示例胶囊**，写在 `src/_data/wardrobe.yml`，页面上标了「示例」。换成自己的衣服时，改这份文件，并把 `status` 从 `example` 改掉。

## 页面从哪来

| 路径 | 内容 |
| --- | --- |
| `/` | 最新文章，以及板块、风格、场景、季节入口 |
| `/articles/<id>/` | 文章 |
| `/sections/<slug>/` | 六个板块 |
| `/styles/<slug>/` | 风格 |
| `/scenes/<slug>/` | 场景 |
| `/seasons/<slug>/` | 季节。标了「秋冬」的文章也会出现在「秋」和「冬」 |
| `/curriculum/` | 三十日课 |
| `/curriculum.json` | 同一份课表，给自动写作用 |
| `/wardrobe/` | 推荐搭配、本机上传、示例单品 |
| `/wardrobe/upload/` | 上传、导出、导入 |

板块、风格、场景、季节的名称在 `src/_data/taxonomies.yml`。文章的 front matter 用中文名，新文章会自动出现在对应页上。

## GitHub Pages

工作流是 `.github/workflows/pages.yml`，在 `main` 上每次推送都会构建并部署。若站点还是 404，仓库管理员需要做一次：

**Settings → Pages → Build and deployment → Source 选 GitHub Actions → 保存。**

选过之后就不用再点。以后每天把文章推到 `main` 即可。
