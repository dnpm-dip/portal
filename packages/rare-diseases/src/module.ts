import {
    addImportsSources, addPlugin, createResolver, defineNuxtModule,
} from '@nuxt/kit';

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
            // todo: there should be a helper function to register pages
            pages.push({
                name: 'rd/index',
                path: '/rd/',
                file: resolver.resolve('./runtime/pages/index.vue'),
                children: [],
            });

            pages.push({
                name: 'rd/search',
                path: '/rd/search',
                file: resolver.resolve('./runtime/pages/search.vue'),
                children: [],
            });
        });

        addImportsSources({
            from: resolver.resolve('./runtime/composables/index'),
            imports: ['useAPIClient', 'useRDAPIClient'],
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
        addPlugin(resolver.resolve('./runtime/plugins/navigation'));
    },
});
