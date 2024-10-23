// https://nuxt.com/docs/api/configuration/nuxt-config
import type { ModuleOptions } from '@authup/client-web-nuxt';
import path from 'node:path';

export default defineNuxtConfig({
    modules: [
        [
            '@authup/client-web-nuxt', {
                apiURLRuntimeKey: 'authupUrl',
                cookieDomainRuntimeKey: 'cookieDomain',
            } satisfies ModuleOptions,
        ],
        '../admin/src/module',
        '../mtb/src/module',
        '../rd/src/module',
    ],
    experimental: {
        scanPageMeta: false,
    },
    devtools: {
        componentInspector: false,
    },
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        '@authup/client-web-kit/index.css',
        '@vuecs/navigation/dist/index.css',
        '@vuecs/pagination/dist/index.css',
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
        apiUrl: process.env.API_URL,
        authupUrl: process.env.AUTHUP_URL,
        public: {
            apiUrl: process.env.API_URL || 'https://dnpm.bwhealthcloud.de/api/',
            authupUrl: process.env.AUTHUP_URL || 'https://dnpm.bwhealthcloud.de/auth/',
            cookieDomain: process.env.COOKIE_DOMAIN,
        },
    },
});
