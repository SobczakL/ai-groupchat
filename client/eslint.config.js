import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            js.configs.recommended,
            // If you add eslint-plugin-react later, you might extend its recommended config:
            // "plugin:react/recommended",
            ...tseslint.configs.recommended,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        settings: {
            react: {
                version: 'detect'
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            // If you install eslint-plugin-react, add it here:
            // react: require('eslint-plugin-react'),
        },
        rules: {
            // Disable the rule requiring React in scope—this is needed with React 17+
            'react/react-in-jsx-scope': 'off',
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
)
