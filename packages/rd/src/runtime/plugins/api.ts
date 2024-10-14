import { injectHTTPClient } from '@dnpm-dip/core';
import { RDHTTPClient, provideHTTPClient } from '../core';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    dependsOn: ['dnpm:kit'],
    async setup(nuxt) {
        const baseClient = injectHTTPClient();
        const client = new RDHTTPClient(baseClient);

        provideHTTPClient(client, nuxt.vueApp);
    },
});
