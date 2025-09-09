export default {
    "*/**/*.{mjs,js,jsx,ts,tsx}": [
        "eslint --fix",
        "eslint"
    ],
    "*/**/*.{json,css,md}": [
        "prettier --write"
    ]
}