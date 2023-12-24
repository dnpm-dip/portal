// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'node:path';

export default defineNuxtConfig({
    modules: [
        // '@dnpm-dip/rare-diseases',
        '../rare-diseases/src/module',
    ],
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'bootstrap/dist/css/bootstrap.css',
        'bootstrap-vue-next/dist/bootstrap-vue-next.css',
        '@/assets/css/bootstrap-override.css',
        '@/assets/css/layout/body.css',
        '@/assets/css/layout/footer.css',
        '@/assets/css/layout/header.css',
        '@/assets/css/layout/navbar.css',
        '@/assets/css/layout/shared.css',
        '@/assets/css/layout/sidebar.css',
        '@/assets/css/vue-layout-navigation.css',
        '@/assets/css/card.css',
        '@/assets/css/list.css',
        '@/assets/css/pagination.css',
    ],
    alias: {
        '@dnpm-dip/core': path.join(__dirname, '..', 'core', 'src'),
    },
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL || 'https://dnpm.bwhealthcloud.de/api/',
        },
    },
});
