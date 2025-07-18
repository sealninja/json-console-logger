import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import eslintConfigs from '@dr.pogodin/eslint-configs';

export default defineConfig([{
  // ignores: ['build/'],
  languageOptions: {
    parserOptions: {
      requireConfigFile: false,
    },
  },
  extends: [
    prettierConfig,
    eslintConfigs.configs.javascript,
    eslintConfigs.configs.react,
  ]}]
);
