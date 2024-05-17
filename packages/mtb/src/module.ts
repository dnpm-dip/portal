import { register } from '@dnpm-dip/kit';
import {
    addPlugin,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit';

export default defineNuxtModule({
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
                    id: 'mtb-search',
                    name: 'Suche',
                    icon: 'fa fa-search',
                    url: '',
                },
            ],
            navigationTopId: 'mtb',
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
    },
});
