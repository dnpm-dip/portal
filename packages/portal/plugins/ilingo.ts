import {
    MemoryStore,
    defineCatalog,
    defineLocale,
    defineNamespace,
    defineTranslations,
} from 'ilingo';
import { install as installIlingoVue } from '@ilingo/vue';
import { install as installIlingoValidup } from '@ilingo/validup-vue';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    name: 'dnpm:ilingo',
    dependsOn: ['authup'],
    setup(nuxt) {
        const app = nuxt.vueApp;

        const catalog = defineCatalog([
            defineLocale('de', [
                defineNamespace('default', [
                    defineTranslations({ hgvs: 'Es müssen ein oder mehrere HGVS-Codes in 3-Buchstaben-Format in der Eingabe vorkommen' }),
                ]),
            ]),
            defineLocale('en', [
                defineNamespace('default', [
                    defineTranslations({ hgvs: 'One or more HGVS codes in 3-letter format must be present in the input' }),
                ]),
            ]),
        ]);

        installIlingoVue(app, { store: new MemoryStore({ data: catalog }) });
        installIlingoValidup(app);
    },
});
