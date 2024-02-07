import { createBootstrap } from 'bootstrap-vue-next';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    async setup(nuxt) {
        nuxt.vueApp.use(createBootstrap({
            plugins: {
                toast: true,
            },
        }));
    },
});
