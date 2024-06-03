import { registerPages } from '@dnpm-dip/kit';
import {
    addPlugin,
    createResolver,
    defineNuxtModule,
} from '@nuxt/kit';

export default defineNuxtModule({
    meta: {
        name: '@dnpm-dip/admin',
        configKey: 'admin',
    },
    // Default configuration options of the Nuxt module
    defaults: {},
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        await registerPages({
            baseURL: '/admin/',
            rootDir: import.meta.url,
        });

        addPlugin(resolver.resolve('./runtime/plugins/register'));
    },
});
