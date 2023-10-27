import { APIClient, install } from '@dnpm-dip/core';
import type { APIClientConfigInput } from '@dnpm-dip/core';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(nuxt) {
        const runtimeConfig = useRuntimeConfig();

        const { apiUrl: baseURL } = runtimeConfig.public;

        const config : APIClientConfigInput = {
            baseURL,
        };

        const client = new APIClient(config);

        install(nuxt.vueApp, {
            apiClient: client,
        });

        return {
            provide: {
                api: client,
            },
        };
    },
});
