const config = {
  "*.{mjs,js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{json,css}": ["prettier --write"],
  "*.md": [`markdownlint-cli2 --fix`],
};

export default config;
