/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { injectTranslatorLocale, install } from '@authup/client-web-kit';
import type { Client } from '@authup/core-http-kit';
import { injectLocale as injectTimeagoLocale } from '@vuecs/timeago';
import type { Pinia } from 'pinia';
import { useAuthStore } from '../stores/auth';

export default defineNuxtPlugin((ctx) => {
    const store = useAuthStore(ctx.$pinia as Pinia);

    ctx.vueApp.use(install, {
        apiClient: ctx.$authupApi as Client,
        store,
        components: false,
    });

    const locale = injectTranslatorLocale();
    locale.value = 'de';

    const timeagoLocale = injectTimeagoLocale();
    timeagoLocale.value = locale.value;
    watch(locale, (val) => {
        timeagoLocale.value = val;
    });
});
