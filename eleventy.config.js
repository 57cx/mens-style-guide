import fs from "node:fs";
import path from "node:path";
import { CORE_SCHEMA, load as parseYaml } from "js-yaml";

const ARTICLE_MEDIA = /\.(svg|png|jpe?g|webp|gif|mp4|webm)$/i;

function copyArticleMedia(outputDir) {
  const articlesDir = path.join("src", "articles");
  if (!fs.existsSync(articlesDir)) return;
  for (const name of fs.readdirSync(articlesDir)) {
    const folder = path.join(articlesDir, name);
    if (!fs.statSync(folder).isDirectory()) continue;
    const dest = path.join(outputDir, "articles", name);
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(folder)) {
      if (ARTICLE_MEDIA.test(file)) {
        fs.copyFileSync(path.join(folder, file), path.join(dest, file));
      }
    }
  }
}

function copyUserOutfitMedia(outputDir) {
  const root = path.join("src", "outfits");
  if (!fs.existsSync(root)) return;
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = path.join(root, entry.name);
    const dest = path.join(outputDir, "media", "outfits", entry.name);
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(folder)) {
      if (ARTICLE_MEDIA.test(file)) {
        fs.copyFileSync(path.join(folder, file), path.join(dest, file));
      }
    }
  }
}

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml,yaml", (contents) =>
    parseYaml(contents, { schema: CORE_SCHEMA })
  );

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/assets/");
  eleventyConfig.addWatchTarget("curriculum.yml");
  eleventyConfig.addWatchTarget("src/_data/");
  eleventyConfig.addWatchTarget("src/outfits/");

  eleventyConfig.addFilter("json", (value) =>
    JSON.stringify(value).replace(/</g, "\\u003c")
  );

  eleventyConfig.addFilter("dateZh", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
  });

  eleventyConfig.addFilter("dayByNumber", (days, number) =>
    (days || []).find((day) => Number(day.day) === Number(number)) || null
  );

  eleventyConfig.addFilter("findBySlug", (articles, slug) => {
    if (!articles) return null;
    return articles.find((item) => item.fileSlug === slug) || null;
  });

  eleventyConfig.addFilter("whereSection", (articles, name) =>
    (articles || []).filter((item) => item.data.section === name)
  );

  eleventyConfig.addFilter("whereStyle", (articles, name) =>
    (articles || []).filter((item) => (item.data.styles || []).includes(name))
  );

  eleventyConfig.addFilter("whereScene", (articles, name) =>
    (articles || []).filter((item) => (item.data.scenes || []).includes(name))
  );

  eleventyConfig.addFilter("whereSeason", (articles, name) =>
    (articles || []).filter((item) => seasonMatch(item.data.seasons || [], name))
  );

  // 风格、场景、季节页用：挑出对应的推荐搭配（带实拍图）
  eleventyConfig.addFilter("outfitsFor", (outfits, kind, name) =>
    (outfits || []).filter((outfit) => {
      if (kind === "style") return outfit.style === name;
      if (kind === "scene") return outfit.scene === name;
      if (kind === "season") return seasonMatch([outfit.season], name) || (outfit.season !== "秋冬" && name === "秋冬" && ["秋", "冬"].includes(outfit.season));
      return false;
    })
  );

  eleventyConfig.addFilter("coverFor", (outfits, kind, name) => {
    const found = (outfits || []).find((outfit) =>
      kind === "style" ? outfit.style === name : kind === "scene" ? outfit.scene === name : false
    );
    return found ? found.photo_look || found.photo_flat || found.image : "";
  });

  eleventyConfig.addFilter("termSlug", (list, name) => {
    const found = (list || []).find((item) => item.name === name);
    return found ? found.slug : "";
  });

  eleventyConfig.addCollection("articles", (api) =>
    api
      .getFilteredByGlob("src/articles/**/*.md")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    copyArticleMedia(dir.output);
    copyUserOutfitMedia(dir.output);
  });

  const pathPrefix =
    process.env.PATH_PREFIX === undefined ? "/mens-style-guide/" : process.env.PATH_PREFIX;

  return {
    pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
  };
}

function seasonMatch(tags, name) {
  if (tags.includes(name)) return true;
  if ((name === "秋" || name === "冬") && tags.includes("秋冬")) return true;
  if ((name === "春" || name === "夏") && tags.includes("春夏")) return true;
  return false;
}
