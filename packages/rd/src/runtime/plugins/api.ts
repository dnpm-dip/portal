import type { HTTPClient } from '@dnpm-dip/core';
import { RDAPIClient } from '../core/api-client';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    enforce: 'post',
    async setup(nuxt) {
        const client = new RDAPIClient(nuxt.$api as HTTPClient);

        return {
            provide: {
                rdApi: client,
            },
        };
    },
});
