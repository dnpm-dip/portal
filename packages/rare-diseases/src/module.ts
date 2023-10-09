import { createResolver, defineNuxtModule } from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@dnpm-dip/rare-diseases',
        configKey: 'rareDiseases',
    },
    // Default configuration options of the Nuxt module
    defaults: {},
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'rd/index',
                path: '/rd/',
                file: resolver.resolve('./runtime/pages/index.vue'),
                children: [],
            });
        });
    },
});
