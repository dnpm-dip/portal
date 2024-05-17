import { install } from '@dnpm-dip/core';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(nuxt) {
        const runtimeConfig = useRuntimeConfig();
        const { apiUrl: baseURL } = runtimeConfig.public;

        install(nuxt.vueApp, {
            baseURL,
        });
    },
});
