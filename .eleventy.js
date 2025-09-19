module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/documents");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addGlobalData("year", () => new Date().getFullYear());

  return {
    // pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/lab_website/",
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk", "css"],
    markdownTemplateEngine: "njk"
  };
};