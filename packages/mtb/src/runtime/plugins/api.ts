import type { HTTPClient } from '@dnpm-dip/core';
import { MTBAPIClient } from '../core/api-client';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    enforce: 'post',
    async setup(nuxt) {
        const client = new MTBAPIClient(nuxt.$api as HTTPClient);

        return {
            provide: {
                mtbApi: client,
            },
        };
    },
});
