import eslintJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const customBase = {
  ignores: ['eslint.config.mjs'],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
    sourceType: 'commonjs',
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: new URL('.', import.meta.url).pathname,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
  },
};

const serviceAndTestOverrides = {
  files: ['src/**/*.service.ts', 'src/**/*.controller.ts', 'src/**/services/**/*.ts', 'test/**/*.ts'],
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
  },
};

const normalize = (entry) => {
  if (!entry) return [];
  return Array.isArray(entry) ? entry : [entry];
};

const finalConfig = [
  ...normalize(eslintJs.configs && eslintJs.configs.recommended),
  ...normalize(tseslint.configs && tseslint.configs.recommendedTypeChecked),
  ...normalize(eslintPluginPrettierRecommended),
  customBase,
  serviceAndTestOverrides,
];

export default finalConfig;
