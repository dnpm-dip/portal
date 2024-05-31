import { PageMetaKey } from '@dnpm-dip/core';
import { register } from '@dnpm-dip/kit';
import {
    addPlugin,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit';
import type { PermissionName } from './runtime/domains';

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
            requireLoggedIn: true,
            navigationItems: [
                {
                    id: 'rd-search',
                    name: 'Suche',
                    icon: 'fa fa-search',
                    url: '',
                    [PageMetaKey.REQUIRED_PERMISSIONS]: [
                        'rd_query_submit',
                    ] satisfies `${PermissionName}`[],
                },
            ],
            navigationTopId: 'rd',
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
    },
});
