import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['test/unit/**/*.spec.ts'],
    },
    plugins: [vue()],
});
