import { register } from '@dnpm-dip/kit';
import {
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
    },
});
