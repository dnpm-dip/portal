/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { App } from 'vue';
import { HTTPClient as Client } from './module';
import { setupBaseHTTPClient } from './setup';
import { isAPIClientInjected, provideAPIClient } from './di';
import type { BaseHTTPClientInstallOptions } from './types';

export function installHTTPClient(app: App, options: BaseHTTPClientInstallOptions) {
    if (isAPIClientInjected(app)) {
        return;
    }

    const client = new Client({ baseURL: options.baseURL });

    setupBaseHTTPClient(app, client);

    provideAPIClient(client, app);
}
