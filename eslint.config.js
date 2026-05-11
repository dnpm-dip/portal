import config from '@tada5hi/eslint-config';

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
