/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import installAuthup from '@authup/client-vue';
import type { APIClient } from '@authup/core';
import type { Pinia } from 'pinia';
import { useAuthStore } from '../stores/auth';

export default defineNuxtPlugin((ctx) => {
    const store = useAuthStore(ctx.$pinia as Pinia);

    ctx.vueApp.use(installAuthup, {
        apiClient: ctx.$authupApi as APIClient,
        store,
        components: false,
        translatorLocale: 'de',
    });
});
