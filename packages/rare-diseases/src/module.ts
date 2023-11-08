import { generateNuxtPages } from '@dnpm-dip/core';
import {
    addImportsSources, addPlugin, createResolver, defineNuxtModule, resolveFiles,
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
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        const directory = resolver.resolve('./runtime/pages');
        const files = await resolveFiles(directory, '**/*{.vue,.ts}');

        const pages = await generateNuxtPages({
            directory,
            files,
            prefix: '/rd',
        });

        nuxt.hook('pages:extend', (items) => {
            items.push(...pages);
        });

        addImportsSources({
            from: resolver.resolve('./runtime/composables/index'),
            imports: ['useAPIClient', 'useRDAPIClient'],
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
        addPlugin(resolver.resolve('./runtime/plugins/chartjs'));
        addPlugin(resolver.resolve('./runtime/plugins/navigation'));
    },
});
