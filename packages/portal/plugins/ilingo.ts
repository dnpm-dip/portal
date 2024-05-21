import install from '@ilingo/vuelidate';
import { MemoryStore } from '@ilingo/vuelidate/core';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    async setup(nuxt) {
        const store = new MemoryStore({
            data: {
                de: {
                    vuelidate: {
                        hgvs: 'Es müssen ein oder mehrere HGVS-Codes in 3-Buchstaben-Format in der Eingabe vorkommen',
                    },
                },
            },
        });

        nuxt.vueApp.use(install, {
            store,
        });
    },
});
