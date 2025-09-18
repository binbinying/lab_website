module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/documents");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/lab_website/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk"
  };
};