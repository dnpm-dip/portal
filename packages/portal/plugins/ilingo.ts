import install from '@ilingo/vuelidate';
import { MemoryStore } from '@ilingo/vuelidate/core';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    async setup(nuxt) {
        const store = new MemoryStore({
            data: {
                de: {
                    vuelidate: {
                        hgvs: 'Es muss einer oder mehrere gültige HGVS Codes in der Eingabe vorkommen',
                    },
                },
            },
        });

        nuxt.vueApp.use(install, {
            store,
        });
    },
});
