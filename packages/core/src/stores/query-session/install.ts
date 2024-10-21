/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { defineStore } from 'pinia';
import type { App } from 'vue';
import type { StoreInstallOptions } from '../types';
import { createQuerySessionStore } from './module';
import { hasQuerySessionStore, provideQuerySessionStore } from './singleton';

export function installQuerySessionStore(app: App, options: StoreInstallOptions) {
    if (hasQuerySessionStore(app)) {
        return;
    }

    const storeCreator = defineStore(
        'querySession',
        () => createQuerySessionStore(options),
    );

    provideQuerySessionStore(storeCreator, app);
}
