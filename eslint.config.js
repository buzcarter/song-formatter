/**
 * ESLint "flat" config (ESLint 9+). Same rules as the old .eslintrc.cjs: airbnb-base's style
 * and best-practice rules for everything, plus typescript-eslint's recommended rules for .ts.
 *
 * airbnb-base hasn't been updated for flat config or ESLint 9/10, so its rule files are
 * loaded through FlatCompat, the official adapter for old-style configs, and package.json
 * `overrides` lets it install next to ESLint 10. If it ever stops working,
 * eslint-config-airbnb-extended is the community's flat-config version.
 */
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const require = createRequire(import.meta.url);
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const OFF = 0;
const ERROR = 2;

const airbnbRules = [
  'best-practices',
  'errors',
  'node',
  'style',
  'variables',
  'es6',
  'strict',
].map((name) => require.resolve(`eslint-config-airbnb-base/rules/${name}`));

export default [
  {
    ignores: ['coverage/**', 'dist/**', '.site/**', '.tmp/**', 'node_modules/**'],
  },
  ...compat.config({ extends: airbnbRules }),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      'default-case': OFF,
      'function-paren-newline': OFF,
      'max-len': OFF,
      'no-param-reassign': OFF,
      'no-plusplus': OFF,
      'no-underscore-dangle': OFF,
      'no-use-before-define': OFF,
      'object-curly-newline': [ERROR, {
        ImportDeclaration: {
          multiline: true,
          minProperties: 5,
        },
      }],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
  },
  ...tseslint.config({
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  }),
  {
    files: ['**/*.test.js'],
    languageOptions: { globals: globals.jest },
  },
  {
    // the parity and snapshot tests run in jsdom, a browser-like environment
    files: ['test/**/*.test.js'],
    languageOptions: { globals: globals.browser },
  },
];
