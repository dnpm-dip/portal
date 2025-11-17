import { Directives, createBootstrap } from 'bootstrap-vue-next';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    async setup(nuxt) {
        nuxt.vueApp.use(createBootstrap());

        const keys = Object.keys(Directives);
        for (let i = 0; i < keys.length; i++) {
            const name = keys[i];

            if (name) {
                nuxt.vueApp.directive(name.replace(/^v/, ''), Directives[name as keyof typeof Directives]);
            }
        }
    },
});
