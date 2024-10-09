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

        const { hostname } = new URL(baseURL || 'http://localhost:3000');
        const cookieOptions : { domain?: string } = {
            domain: hostname,
        };

        ctx.vueApp.use(install, {
            baseURL,
            cookieSet: (key, value) => {
                const app = tryUseNuxtApp();
                if (app) {
                    const cookie = useCookie(key, cookieOptions);
                    cookie.value = value;
                }
            },
            cookieUnset: (key) => {
                const app = tryUseNuxtApp();
                if (app) {
                    const cookie = useCookie(key, cookieOptions);
                    cookie.value = null;
                }
            },
            cookieGet: (key) => {
                const app = tryUseNuxtApp();
                if (app) {
                    const cookie = useCookie(key, cookieOptions);
                    return cookie.value;
                }

                return null;
            },
        });
    },
});
