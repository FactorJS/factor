/**
 * @type import("eslint-define-config")
 */
const { defineConfig } = require("eslint-define-config")

module.exports = defineConfig({
  root: true,
  globals: {
    module: false,
    process: false,
    to: false,
    describe: false,
    context: false,
    globalThis: false,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    extraFileExtensions: [".vue", ".json"],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: [
    "**/node_modules/!(@factor|@kaption)/**",
    "cdk.out/**",
    "**/regex*",
    "*eslint*",
    "**/.ref/*",
    "**/.ref*",
    "**/__*",
  ],
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:unicorn/recommended",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "plugin:tailwindcss/recommended",
  ],

  plugins: [
    "json",
    "prettier",
    "unicorn",
    "import",
    "@typescript-eslint",
    "tailwindcss",
  ],

  rules: {
    semi: ["error", "never"],
    curly: ["warn", "multi-line"],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",

    "no-undef": "off",
    "func-style": ["warn", "expression"],
    "no-async-promise-executor": "off",

    "vue/no-v-html": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "import/order": [
      "warn",
      {
        pathGroups: [
          {
            pattern: "@factor/**",
            group: "internal",
            position: "before",
          },
        ],
      },
    ],
    "import/no-cycle": [
      "error",
      {
        maxDepth: 5,
        ignoreExternal: true,
      },
    ],
    "import/named": "off",
    // namspace errors in CI and is duplicate of TS functionality
    "import/namespace": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      { ts: "never", js: "never" },
    ],
    "import/no-unresolved": [
      "error",
      { commonjs: true, caseSensitiveStrict: true, amd: true },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        peerDependencies: true,
        optionalDependencies: false,
      },
    ],
    "unicorn/consistent-function-scoping": "off",
    "unicorn/no-abusive-eslint-disable": 0,
    "unicorn/prevent-abbreviations": "off",
    "unicorn/filename-case": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/prefer-switch": "off",
    "unicorn/prefer-export-from": "off",
    "unicorn/explicit-length-check": "off", // sometimes we need to use length
    "unicorn/consistent-destructuring": "off",
    "unicorn/prefer-module": "off",
    "unicorn/no-null": "off",
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/prefer-node-protocol": "off",
    "unicorn/prefer-json-parse-buffer": "off",
    "unicorn/prefer-top-level-await": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/prefer-namespace-keyword": "off",
    "@typescript-eslint/no-namespace": 0,
    "explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        allowDirectConstAssertionInArrowFunctions: true,
      },
    ],
    "@typescript-eslint/no-use-before-define": ["warn", { variables: false }], // can cause organization issues
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-var-requires": "off", // overridden for transpiled .ts files
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "no-unused-vars": "off",

    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "tailwindcss/no-custom-classname": "off",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "unicorn/consistent-function-scoping": "off",
      },
    },
    {
      files: ["**/*test*", "**/*test*/**"],
      rules: {
        "no-console": "off",
        "unicorn/no-abusive-eslint-disable": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],

  settings: {
    tailwindcss: {
      officialSorting: true,
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".mjs", ".ts", ".d.ts", ".vue", ".md"],
      },
    },
  },
})
