import { register } from '@dnpm-dip/kit';
import {
    addImportsSources, addPlugin, createResolver,
    defineNuxtModule,
} from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@dnpm-dip/mtb',
        configKey: 'mtb',
    },
    defaults: {},
    async setup(_options, _nuxt) {
        const resolver = createResolver(import.meta.url);

        await register({
            name: 'MTB',
            baseURL: '/mtb/',
            rootDir: import.meta.url,
            navigationItems: [
                {
                    id: 'mtb-home',
                    name: 'Home',
                    icon: 'fa fa-home',
                    url: '',
                    root: true,
                },
                {
                    id: 'mtb-search',
                    name: 'Suche',
                    icon: 'fa fa-search',
                    url: 'search',
                },
            ],
            navigationTopId: 'mtb',
        });

        addImportsSources({
            from: resolver.resolve('./runtime/composables/index'),
            imports: ['useAPIClient', 'useMTBAPIClient'],
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
    },
});
