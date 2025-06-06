import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const config = tseslint.config(
  { ignores: ['dist', 'node_modules', 'example', 'example2'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);

export default config
