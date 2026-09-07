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
            '@dnpm-dip/vue/testing': path.resolve(__dirname, '../../vue/src/testing'),
            '@dnpm-dip/http-kit/testing': path.resolve(__dirname, '../../http-kit/src/testing'),
            '@dnpm-dip/vue': path.resolve(__dirname, '../../vue/src'),
            '@dnpm-dip/http-kit': path.resolve(__dirname, '../../http-kit/src'),
            '@dnpm-dip/kit': path.resolve(__dirname, '../../kit/src'),
        },
    },
});
