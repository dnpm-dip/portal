import { injectHTTPClient } from '@dnpm-dip/core';
import { AdminHTTPClient, provideHTTPClient } from '../core';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    dependsOn: ['dnpm:kit'],
    async setup(nuxt) {
        const baseClient = injectHTTPClient();
        const client = new AdminHTTPClient(baseClient);

        provideHTTPClient(client, nuxt.vueApp);
    },
});
