import js from '@eslint/js'
import globals from 'globals'
import tseslint, { type ConfigArray } from 'typescript-eslint'

const config: ConfigArray = tseslint.config(
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
