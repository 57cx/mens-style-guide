export default {
  layout: "article.njk",
  eleventyComputed: {
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      return `/articles/${data.page.fileSlug}/`;
    },
  },
};
