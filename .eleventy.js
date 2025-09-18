module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/documents");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    pathPrefix: "/lab_website/", // ✅ Important for correct URLs
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk"
  };
};