import { PageMetaKey } from '@dnpm-dip/core';
import { register } from '@dnpm-dip/kit';
import {
    addPlugin,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit';
import { PermissionName } from './runtime/domains';

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
                    [PageMetaKey.REQUIRED_PERMISSIONS]: PermissionName.QUERY_SUBMIT,
                },
            ],
            navigationTopId: 'mtb',
        });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
    },
});
