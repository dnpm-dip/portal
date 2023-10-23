import { APIClient } from '@dnpm-dip/core';
import { defineNuxtPlugin } from '#app';
import { useAPIClient } from '../composables/api-client';

export default defineNuxtPlugin({
    name: 'rdApi',
    enforce: 'pre',
    async setup() {
        const baseClient = useAPIClient();

        const client = new APIClient(baseClient);

        return {
            provide: {
                rdApi: client,
            },
        };
    },
});
