import { createPinia, setActivePinia } from 'pinia';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin<Record<string, any>>({
    enforce: 'pre',
    async setup(nuxt) {
        const pinia = createPinia();
        nuxt.vueApp.use(pinia);
        setActivePinia(pinia);

        if (process.server) {
            nuxt.payload.pinia = pinia.state.value;
        } else if (nuxt.payload && nuxt.payload.pinia) {
            pinia.state.value = nuxt.payload.pinia;
        }

        // Inject $pinia
        return {
            provide: {
                pinia,
            },
        };
    },
});
