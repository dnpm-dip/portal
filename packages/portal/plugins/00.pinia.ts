/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { StateTree } from 'pinia';
import { createPinia, setActivePinia } from 'pinia';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin<Record<string, any>>({
    enforce: 'pre',
    async setup(nuxt) {
        const pinia = createPinia();
        nuxt.vueApp.use(pinia);
        setActivePinia(pinia);

        if (import.meta.server) {
            nuxt.payload.pinia = pinia.state.value;
        } else if (nuxt.payload && nuxt.payload.pinia) {
            pinia.state.value = nuxt.payload.pinia as Record<string, StateTree>;
        }

        // Inject $pinia
        return {
            provide: {
                pinia,
            },
        };
    },
});
