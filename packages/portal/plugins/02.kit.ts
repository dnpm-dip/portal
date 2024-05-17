import { install } from '@dnpm-dip/core';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(ctx) {
        const runtimeConfig = useRuntimeConfig();
        const { apiUrl: baseURL } = runtimeConfig.public;

        install(ctx.vueApp, {
            baseURL,
        });
    },
});
