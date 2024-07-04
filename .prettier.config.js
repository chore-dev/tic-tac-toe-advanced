/** @type {import("prettier").Config} */

const config = {
  arrowParens: 'avoid',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: true,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  semi: true,
  singleAttributePerLine: true,
  trailingComma: 'none',
  overrides: [
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always'
      }
    }
  ]
};

module.exports = config;
