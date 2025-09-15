const config = {
  "*.{mjs,js,jsx,ts,tsx}": (stagedFiles) => [
    `eslint --fix ${stagedFiles.join(" ")}`,
  ],
  "*.{json,css}": (stagedFiles) => [
    `prettier --write ${stagedFiles.join(" ")}`,
  ],
  "*.md": (stagedFiles) => [`markdownlint-cli2 --fix ${stagedFiles.join(" ")}`],
};

export default config;
