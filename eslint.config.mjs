import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettierFlat from 'eslint-config-prettier/flat';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.source/**',
  ]),
  {
    extends: [
      eslintConfigPrettierFlat,
      eslintPluginUnicorn.configs.recommended,
      sonarjs.configs.recommended,
    ],
    rules: {
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'sonarjs/void-use': 'off',
    },
  },
]);

export default eslintConfig;
