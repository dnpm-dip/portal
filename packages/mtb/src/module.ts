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
            requireLoggedIn: true,
            navigationItems: [
                {
                    id: 'mtb-search',
                    name: 'Suche',
                    icon: 'fa fa-search',
                    url: '',
                    [PageMetaKey.REQUIRED_PERMISSIONS]: [
                        'mtb_query_submit',
                    ] satisfies `${PermissionName}`[],
                },
            ],
            navigationTopId: 'mtb',
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
    },
});
