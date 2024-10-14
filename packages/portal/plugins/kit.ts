import { install } from '@dnpm-dip/core';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
    name: 'dnpm:kit',
    dependsOn: ['authup'],
    async setup(ctx) {
        const runtimeConfig = useRuntimeConfig();

        let baseURL : string | undefined;
        if (import.meta.server) {
            baseURL = runtimeConfig.apiUrl;
        }

        if (!baseURL) {
            baseURL = runtimeConfig.public.apiUrl;
        }

        install(ctx.vueApp, {
            baseURL,
        });
    },
});
