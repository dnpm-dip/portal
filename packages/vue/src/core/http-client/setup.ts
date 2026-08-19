/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { injectHTTPClientAuthenticationHook } from '@authup/client-web-kit';
import type { App } from 'vue';
import type { IHTTPClient } from '@dnpm-dip/http-kit';

export function setupBaseHTTPClient(app: App, client: IHTTPClient) {
    const tokenHook = injectHTTPClientAuthenticationHook(app);
    tokenHook.attach(client);
}
