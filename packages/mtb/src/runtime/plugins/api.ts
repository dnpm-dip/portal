import { injectHTTPClient } from '@dnpm-dip/core';
import { MTBAPIClient, provideHTTPClient } from '../core/http-client';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    dependsOn: ['dnpm:kit'],
    async setup(nuxt) {
        const baseClient = injectHTTPClient();
        const client = new MTBAPIClient(baseClient);

        provideHTTPClient(client, nuxt.vueApp);
    },
});
