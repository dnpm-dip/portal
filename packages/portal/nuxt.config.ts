// https://nuxt.com/docs/api/configuration/nuxt-config
import type { ModuleOptions } from '@authup/client-web-nuxt';
import path from 'node:path';
import { NuxtIconBundle } from '@nuxt/icon/vite';
import tailwindcss from '@tailwindcss/vite';

const repositoryRoot = path.join(__dirname, '..', '..');

export default defineNuxtConfig({
    vite: {
        plugins: [
            tailwindcss(),
            // Bundle only the Font Awesome icons this UI actually renders.
            // Registering the full `fa6-solid` + `fa6-brands` collections used
            // to ship ~429 KB gzip on every page load for ~290 icons in use.
            // The virtual register module below feeds `addIcon` from
            // `@iconify/vue` — the very store `<VCIcon>` resolves against — so
            // no component changes are needed.
            //
            // The glob list is load-bearing and fails *silently*: a path that
            // stops matching yields an empty icon slot in the browser, never a
            // build error. Scanning must therefore cover every place an icon
            // name can be written:
            //  - the portal's own template tree,
            //  - `src/` of every sibling package — `admin`, `mtb` and `rd`
            //    are registered from `../<name>/src/module`, and `core`/`kit`
            //    are aliased to `../<name>/src`, so the sources (not the
            //    dists) are what the portal builds,
            //  - `@authup/client-web-kit`, whose components and
            //    identity-provider preset tables carry icon names,
            //  - `@vuecs/icons-font-awesome`, whose preset supplies the vuecs
            //    behavioral defaults (pagination arrows, submit button, alert,
            //    collapse chevrons). Those names exist in no repo source file.
            // `.ts` must be listed explicitly — the plugin scans
            // `.vue`/`.jsx`/`.tsx` by default, while nav item tables and preset
            // maps are plain TS modules.
            NuxtIconBundle({
                cwd: repositoryRoot,
                scan: {
                    globInclude: [
                        'packages/portal/{app,error}.vue',
                        'packages/portal/{components,config,core,layouts,middleware,pages,plugins,stores}/**/*.{vue,ts}',
                        'packages/{admin,core,kit,mtb,rd,theme}/src/**/*.{vue,ts}',

                        'node_modules/@authup/client-web-kit/dist/**/*.mjs',
                        'node_modules/@vuecs/icons-font-awesome/dist/*.mjs',
                    ],
                    // The default excludes `node_modules` and `dist`, which
                    // would drop the two paths above.
                    globExclude: [],
                },
            }),
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

    // The OAuth2 callback must render client-side only: the authorization-code
    // exchange needs the PKCE `code_verifier` held in sessionStorage, so running
    // it during SSR would exchange without a verifier and burn the single-use
    // code before the client can retry. Mirrors PrivateAIM/hub + authup/authup.
    routeRules: { '/login/callback': { ssr: false } },

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
        '@dnpm-dip/nuxt-kit': path.join(__dirname, '..', 'nuxt-kit', 'src'),
    },

    runtimeConfig: {
        apiUrl: process.env.API_URL,
        authupUrl: process.env.AUTHUP_URL,
        public: {
            version: process.env.npm_package_version,
            apiUrl: process.env.API_URL || 'https://dnpm-dip.net/api/',
            authupUrl: process.env.AUTHUP_URL || 'https://dnpm-dip.net/auth/',
            // OAuth2 client used for the authorization-code (PKCE) login flow.
            // Defaults to Authup's built-in "admin-console" system client at the
            // call site; override per deployment (deployments on Authup
            // <= v1.0.0-beta.58 set AUTHUP_CLIENT_ID=web). The portal origin
            // must be listed in Authup's TRUSTED_ORIGINS so the redirect to
            // `<portal-origin>/login/callback` is allowed.
            authupClientId: process.env.AUTHUP_CLIENT_ID,
            // Realm hint for resolving a name-identified client on `/authorize`
            // (Authup requires it). Accepts a realm UUID or name; defaults to
            // REALM_MASTER_NAME at the call site.
            authupRealmId: process.env.AUTHUP_REALM_ID,
            // Self-service account console (profile, password, authenticators,
            // sessions, applications), served by Authup's server-core on the
            // IdP origin as of v1.0.0-beta.59. The portal has no settings area
            // of its own and links here instead. Empty falls back to
            // `<authupUrl>/account` at the call site; override per deployment
            // (NUXT_PUBLIC_ACCOUNT_URL at container runtime).
            accountUrl: process.env.ACCOUNT_URL || '',
            cookieDomain: process.env.COOKIE_DOMAIN,
        },
    },

    compatibilityDate: '2025-01-09',
});
