const react = require("eslint-plugin-react");
const globals = require("globals");
const reactRecommended = require("eslint-plugin-react/configs/recommended.js");

module.exports = [
  reactRecommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion  : "latest",
      sourceType   : "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      indent: [2, 4, {
        SwitchCase: 1,
      }],
      "linebreak-style": [2, "unix"],
      "eol-last": 2,
      "no-trailing-spaces": 2,
      semi: [2, "always"],
      camelcase: [2, {
        properties: "never",
      }],
      curly: [2, "all"],
      "brace-style": [2, "1tbs", {
        allowSingleLine: true,
      }],
      "no-with": 2,
      "keyword-spacing": [2, {}],
      "space-before-blocks": [2, "always"],
      "space-before-function-paren": [2, {
        anonymous: "ignore",
        named: "never",
      }],
      "comma-spacing": [2, {
        after: true,
        before: false,
      }],
      "semi-spacing": [2, {
        before: false,
        after: true,
      }],
      "key-spacing": [2, {
        beforeColon: false,
        afterColon: true,
        mode: "minimum",
      }],
      "padded-blocks": [2, "never"],
      "newline-after-var": [2, "always"],
      "max-len": [2, 100],
      "comma-style": [2, "last"],
      "no-multi-str": 2,
      "wrap-iife": ["error", "any"],
      "no-console": 0,
    },
  },
];
