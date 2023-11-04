module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',
    parser: "@typescript-eslint/parser"
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  extends: [
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '/lib', '/coverage', '/__snapshots__'],
  rules: {
    'no-console': ["error", { allow: ["info", "warn", "error"] }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'max-len': ['error', 140, 2 , {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    "@next/next/no-html-link-for-pages": ["error", "src/client/pages/"],
    "@next/next/no-document-import-in-page": "off"
  },
};