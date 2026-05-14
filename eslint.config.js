// ESLint flat config (ESLint v9+) — adapté Vite + React + JS pur
import js              from '@eslint/js'
import globals         from 'globals'
import reactPlugin     from 'eslint-plugin-react'
import reactHooks      from 'eslint-plugin-react-hooks'
import reactRefresh    from 'eslint-plugin-react-refresh'

export default [
  // Ignorés globaux
  { ignores: ['dist', 'node_modules', 'backend/node_modules', 'backend/dist', 'coverage'] },

  // JS + JSX
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType:  'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react':         reactPlugin,
      'react-hooks':   reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: '18.3' },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Adapté à JSX moderne (pas de import React requis)
      'react/react-in-jsx-scope':    'off',
      'react/prop-types':            'off',           // on est en JS pur, pas de PropTypes
      'react/jsx-uses-react':        'off',
      'react/no-unescaped-entities': 'off',           // le français a beaucoup d'apostrophes

      // Hygiène
      'no-unused-vars':              ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console':                  ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-empty':                    ['error', { allowEmptyCatch: true }],

      // React Refresh (HMR Vite)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Backend Node.js
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType:  'module',
      globals:     globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
    },
  },
]
