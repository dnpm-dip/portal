/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    injectHTTPClient,
    installQueryFilterStore,
    installQuerySessionStore,
    useQuerySessionStore,
} from '@dnpm-dip/core';
import type { Pinia } from 'pinia';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    dependsOn: ['dnpm:kit'],
    async setup(nuxt) {
        installQueryFilterStore(nuxt.vueApp);
        installQuerySessionStore(nuxt.vueApp);

        const coreAPI = injectHTTPClient();
        const store = useQuerySessionStore(nuxt.$pinia as Pinia, nuxt.vueApp);

        store.eventEmitter.on('expiring', async (ctx) => {
            if (!ctx.useCase) {
                store.eventEmitter.emit('refreshFailed');
                return;
            }

            try {
                const newQuery = await coreAPI.query.getOne(ctx.useCase, ctx.session.id);

                store.track(newQuery);
            } catch (e) {
                store.eventEmitter.emit('refreshFailed');
            }
        });
    },
});
