module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  env: {
    node: true,
    es6: true
  },
  rules: {
    "no-unused-vars": ["error", { args: "after-used", argsIgnorePattern: "^_" }]
  }
};
