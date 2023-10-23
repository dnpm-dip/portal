// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'node:path';

export default defineNuxtConfig({
    modules: [
        // todo: change to package name on publish
        // '@dnpm-dip/rare-diseases',
        '../rare-diseases/src/module',
    ],
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'bootstrap/dist/css/bootstrap.css',
        '@/assets/css/core/header.css',
        '@/assets/css/core/navbar.css',
        '@/assets/css/core/body.css',
        '@/assets/css/core/sidebar.css',
        '@/assets/css/core/footer.css',
        '@/assets/css/root.css',
    ],
    alias: {
        '@dnpm-dip/core': path.join(__dirname, '..', 'core', 'src'),
    },
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL || 'https://bwhealthcloud.de/api/',
        },
    },
});
