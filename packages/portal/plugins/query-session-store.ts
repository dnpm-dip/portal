/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { injectHTTPClient, injectQueryEventBus, useQuerySessionStore } from '@dnpm-dip/core';
import { QueryEventBusEventName } from '@dnpm-dip/core/services/query-event-bus/constants';
import type { Pinia } from 'pinia';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    dependsOn: ['dnpm:kit'],
    async setup(nuxt) {
        const coreAPI = injectHTTPClient(nuxt.vueApp);

        const eventBus = injectQueryEventBus(nuxt.vueApp);
        const store = useQuerySessionStore(nuxt.$pinia as Pinia, nuxt.vueApp);

        eventBus.on(QueryEventBusEventName.SESSION_EXPIRING, async (session, useCase) => {
            if (!useCase) {
                eventBus.emit(QueryEventBusEventName.SESSION_REFRESH_FAILED, session, useCase);
                return;
            }

            try {
                const newQuery = await coreAPI.query.getOne(useCase, session.id);

                store.track(newQuery);
            } catch (e) {
                eventBus.emit(QueryEventBusEventName.SESSION_REFRESH_FAILED, session, useCase);
            }
        });
    },
});
