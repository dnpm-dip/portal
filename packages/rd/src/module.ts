import { register } from '@dnpm-dip/kit';
import {
    addPlugin,
    createResolver,
    defineNuxtModule,
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
                    id: 'rd-search',
                    name: 'Suche',
                    icon: 'fa fa-search',
                    url: '',
                },
            ],
            navigationTopId: 'rd',
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
    },
});
