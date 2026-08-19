import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['test/unit/**/*.spec.ts'],
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@dnpm-dip/core/testing': path.resolve(__dirname, '../../core/src/testing'),
            '@dnpm-dip/core': path.resolve(__dirname, '../../core/src'),
        },
    },
});
