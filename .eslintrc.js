// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    'no-trailing-spaces': "error",
    '@typescript-eslint/no-var-requires': "off",
    '@typescript-eslint/no-explicit-any': "off"
  },
};
