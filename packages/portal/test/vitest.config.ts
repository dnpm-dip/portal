import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: { include: ['test/unit/**/*.spec.ts'] },
    plugins: [vue()],
    resolve: {
        alias: {
            '#app': 'nuxt/app',
            '#imports': 'nuxt/app',
        },
    },
});
