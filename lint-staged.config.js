/** @type {import("lint-staged").Config} */

const config = {
  '*': ['pnpm run prettier:fix:no-glob', 'pnpm run eslint:fix:no-glob']
};

module.exports = config;
