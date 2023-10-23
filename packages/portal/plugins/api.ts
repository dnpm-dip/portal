import { APIClient } from '@dnpm-dip/core';
import type { APIClientConfigInput } from '@dnpm-dip/core';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
    async setup() {
        const runtimeConfig = useRuntimeConfig();

        const { apiUrl: baseURL } = runtimeConfig.public;

        const config : APIClientConfigInput = {
            baseURL,
        };

        const client = new APIClient(config);

        return {
            provide: {
                api: client,
            },
        };
    },
});
