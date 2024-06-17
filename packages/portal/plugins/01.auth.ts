/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { install } from '@authup/client-web-kit';
import {
    defineNuxtPlugin, tryUseNuxtApp, useCookie, useRuntimeConfig,
} from '#imports';

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(ctx) {
        const runtimeConfig = useRuntimeConfig();
        const { authupUrl: baseURL } = runtimeConfig.public;

        ctx.vueApp.use(install, {
            baseURL,
            cookieSet: (key, value) => {
                const app = tryUseNuxtApp();
                if (app) {
                    const cookie = useCookie(key);
                    cookie.value = value;
                }
            },
            cookieUnset: (key) => {
                const app = tryUseNuxtApp();
                if (app) {
                    const cookie = useCookie(key);
                    cookie.value = null;
                }
            },
            cookieGet: (key) => {
                const app = tryUseNuxtApp();
                if (app) {
                    const cookie = useCookie(key);
                    return cookie.value;
                }

                return null;
            },
        });
    },
});
