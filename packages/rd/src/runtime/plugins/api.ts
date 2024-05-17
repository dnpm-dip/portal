import { injectHTTPClient } from '@dnpm-dip/core';
import { RDHTTPClient, provideHTTPClient } from '../core';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    enforce: 'post',
    async setup(nuxt) {
        const baseClient = injectHTTPClient();
        const client = new RDHTTPClient(baseClient);

        provideHTTPClient(client, nuxt.vueApp);
    },
});
