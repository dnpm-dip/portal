// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'node:path';

export default defineNuxtConfig({
    modules: [
        '../admin/src/module',
        '../mtb/src/module',
        '../rd/src/module',
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
        '@/assets/css/form.css',
        '@/assets/css/list.css',
        '@/assets/css/pagination.css',
        '@vuecs/form-controls/dist/index.css',
    ],
    alias: {
        '@dnpm-dip/core': path.join(__dirname, '..', 'core', 'src'),
        '@dnpm-dip/kit': path.join(__dirname, '..', 'kit', 'src'),
    },
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL || 'https://dnpm.bwhealthcloud.de/api/',
            authupUrl: process.env.AUTHUP_URL || 'https://dnpm.bwhealthcloud.de/auth/',
        },
    },
});
