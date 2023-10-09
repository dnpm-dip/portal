// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'node:path';

export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@dnpm-dip/rare-diseases',
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
        '@dnpm-dip/rare-diseases': path.join(__dirname, '..', 'rare-diseases', 'src'),
    },
});
