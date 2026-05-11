import { Directives, createBootstrap } from 'bootstrap-vue-next';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    async setup(nuxt) {
        nuxt.vueApp.use(createBootstrap());

        for (const name of Object.keys(Directives)) {
            nuxt.vueApp.directive(name.replace(/^v/, ''), Directives[name as keyof typeof Directives]);
        }
    },
});
