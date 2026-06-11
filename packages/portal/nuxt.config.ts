// https://nuxt.com/docs/api/configuration/nuxt-config
import type { ModuleOptions } from '@authup/client-web-nuxt';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    modules: [
        [
            '@authup/client-web-nuxt', 
{
    apiURLRuntimeKey: 'authupUrl',
    cookieDomainRuntimeKey: 'cookieDomain',
} satisfies ModuleOptions,
        ],
        '../admin/src/module',
        '../mtb/src/module',
        '../rd/src/module',
        '@vuecs/nuxt',
    ],

    vuecs: {
        injectTokens: false,
        themes: [],
        colorMode: { value: 'system' },
        colorPalette: false,
    },

    experimental: { scanPageMeta: false },

    devtools: { componentInspector: false },

    css: [
        // App-local Tailwind v4 entry — `@import`s @dnpm-dip/theme
        // (which transitively pulls in @authup/client-web-kit-theme +
        // tailwindcss + @vuecs/design + @vuecs/theme-tailwind + every
        // migrated chrome stylesheet) and adds `@source` scopes for this
        // app's template tree + the four sibling module packages +
        // nested vuecs deps. The theme package absorbed all the former
        // local assets/css/* project stylesheets.
        '@/assets/css/tailwind.css',
        '@authup/client-web-kit/dist/style.css',
        '@dnpm-dip/core/../dist/index.css',
        // Self-hosted webfonts — the theme's font stacks (Nunito body,
        // Asap headings) were declared but no @font-face ever shipped;
        // without these the UI silently falls back to the browser
        // default sans.
        '@fontsource/nunito/300.css',
        '@fontsource/nunito/400.css',
        '@fontsource/nunito/600.css',
        '@fontsource/nunito/700.css',
        '@fontsource/asap/700.css',
    ],

    alias: {
        '@dnpm-dip/core': path.join(__dirname, '..', 'core', 'src'),
        '@dnpm-dip/kit': path.join(__dirname, '..', 'kit', 'src'),
    },

    runtimeConfig: {
        apiUrl: process.env.API_URL,
        authupUrl: process.env.AUTHUP_URL,
        public: {
            apiUrl: process.env.API_URL || 'https://dnpm-dip.net/api/',
            authupUrl: process.env.AUTHUP_URL || 'https://dnpm-dip.net/auth/',
            cookieDomain: process.env.COOKIE_DOMAIN,
        },
    },

    compatibilityDate: '2025-01-09',
});
