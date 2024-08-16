const esLint = require('@eslint/js');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const reactRecommended = require('eslint-plugin-react/configs/recommended');
const globals = require('globals');
const tsESLint = require('typescript-eslint');
const prettierConfig = require('./.prettier.config.js');

const config = tsESLint.config(
  {
    ignores: [
      // Backup files
      '.composer.bak/',
      // Build output directory
      'coverage/',
      'build/',
      'bundle/',
      'dist/',
      'out/',
      'packages/',
      'server/',
      // Cache files
      '.eslintcache',
      // Config files
      '.prettier.config.js',
      'commitlint.config.js',
      'eslint.config.js',
      'lint-staged.config.js',
      'tailwind.config.js'
    ]
  },
  esLint.configs.recommended,
  ...tsESLint.configs.recommended,
  prettierRecommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        ...globals.serviceworker,
        ...globals.worker
      }
    },
    rules: {
      ...reactRecommended.rules,
      'import/no-duplicates': 'off',
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'prettier/prettier': ['error', prettierConfig],
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description'
        }
      ],
      '@typescript-eslint/ban-types': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
);

module.exports = config;
