import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended",
  ),
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          plugins: ["@trivago/prettier-plugin-sort-imports"],
          importOrder: [
            "^react$",
            "^next(/.*)?$",
            "<THIRD_PARTY_MODULES>",
            "@/.*",
          ],
          importOrderSeparation: true,
          importOrderSortSpecifiers: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*", "../*"],
              message:
                "Avoid relative imports. Use the '@/' alias for absolute paths instead.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
