module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/documents");

  return {
    dir: {
      input: "src",         // <-- Tell Eleventy to look in /src
      output: "_site",
      includes: "_includes" // <-- _includes is under /src/_includes
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk"
  };
};