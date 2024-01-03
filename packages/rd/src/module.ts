import { register } from '@dnpm-dip/kit';
import {
    addImportsSources, addPlugin, createResolver, defineNuxtModule,
} from '@nuxt/kit';

export default defineNuxtModule({
    meta: {
        name: '@dnpm-dip/rd',
        configKey: 'rd',
    },
    // Default configuration options of the Nuxt module
    defaults: {},
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        await register({
            name: 'RD',
            baseURL: '/rd/',
            rootDir: import.meta.url,
            navigationItems: [
                {
                    id: 'rd-home',
                    name: 'Home',
                    icon: 'fa fa-home',
                    url: '',
                    root: true,
                },
                {
                    id: 'rd-search',
                    name: 'Suche',
                    icon: 'fa fa-search',
                    url: 'search',
                },
            ],
            navigationTopId: 'rd',
        });

        addImportsSources({
            from: resolver.resolve('./runtime/composables/index'),
            imports: ['useRDAPIClient'],
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
        addPlugin(resolver.resolve('./runtime/plugins/chartjs'));
    },
});
