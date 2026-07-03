import config from '@tada5hi/eslint-config';
import globals from 'globals';

export default [
    ...await config(),
    {
        ignores: [
            '**/dist/**',
            '**/.nuxt/**',
            '**/.output/**',
            '**/node_modules/**',
        ],
    },
    {
        // SFCs are browser/SSR code — the shared config only registers Node
        // globals for `.vue` files, so DOM-only globals (window, document,
        // HTMLCanvasElement, ResizeObserver, …) otherwise trip `no-undef`.
        files: ['**/*.vue'],
        languageOptions: { globals: { ...globals.browser } },
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {
                args: 'after-used',
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
            }],
        },
    },
];
