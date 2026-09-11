import globals from 'globals'
import prettier from 'eslint-config-prettier/flat'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import { configs, plugins } from 'eslint-config-airbnb-extended'
import tseslint from 'typescript-eslint'

const CONTROLLER = ['controller/**/*.{js,jsx,ts,tsx}']

const houseStyle = {
  name: 'sticky-feet/house-style',
  rules: {
    '@eslint-community/eslint-comments/no-unused-disable': 'error',
    '@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    '@stylistic/semi': ['error', 'never'],
    'import-x/no-cycle': 'off',
    'import-x/no-rename-default': 'off',
    'no-console': 'off',
    'no-use-before-define': 'off',
  },
}

export default [
  { ignores: ['**/dist/', '**/*.d.ts', 'game/public/', 'controller/public/'] },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.typescript,
  ...tseslint.configs.recommended,
  comments.recommended,
  {
    name: 'sticky-feet/language',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaVersion: 'latest' },
    },
  },
  houseStyle,
  {
    name: 'sticky-feet/game',
    files: ['game/**/*.js'],
    languageOptions: { globals: { ...globals.browser, process: 'readonly' } },
    rules: {
      // the expando pattern the typescript check relies on
      'dot-notation': 'off',
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    name: 'sticky-feet/common',
    files: ['common/**/*.ts'],
    rules: { 'func-style': ['error', 'expression', { allowArrowFunctions: true }] },
  },
  plugins.react,
  plugins.reactA11y,
  plugins.reactHooks,
  ...configs.react.recommended.map(config => ({ ...config, files: CONTROLLER })),
  {
    name: 'sticky-feet/controller',
    files: CONTROLLER,
    languageOptions: { globals: { ...globals.browser, process: 'readonly' } },
    rules: {
      'class-methods-use-this': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react/destructuring-assignment': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-use-before-define': 'off',
      'import-x/extensions': ['error', 'never', { json: 'always' }],
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/sort-comp': 'off',
      'react/state-in-constructor': 'off',
    },
  },
  { name: 'sticky-feet/controller-formatting', files: CONTROLLER, ...prettier },
  {
    name: 'sticky-feet/tests',
    files: ['**/test/**/*.js', '**/*.test.{js,jsx}'],
    languageOptions: { globals: globals.vitest },
    rules: {
      '@stylistic/max-len': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
  {
    name: 'sticky-feet/node-scripts',
    files: ['localIp.js'],
    languageOptions: { globals: globals.node },
  },
  {
    name: 'sticky-feet/config-files',
    files: ['**/vite.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
    rules: { 'import-x/no-extraneous-dependencies': 'off' },
  },
  {
    // The game is still javascript; its ts-ignores go when it is converted
    name: 'sticky-feet/game-javascript',
    files: ['game/**/*.js'],
    rules: { '@typescript-eslint/ban-ts-comment': 'off' },
  },
]
