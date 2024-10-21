/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { defineStore } from 'pinia';
import type { App } from 'vue';
import type { StoreInstallOptions } from '../types';
import { createQueryFilterStore } from './module';
import { hasQueryFilterStore, provideQueryFilterStore } from './singleton';

export function installQueryFilterStore(
    app: App,
    options: StoreInstallOptions,
) {
    if (hasQueryFilterStore(app)) {
        return;
    }

    const storeCreator = defineStore(
        'queryFilter',
        () => createQueryFilterStore(options),
    );

    provideQueryFilterStore(storeCreator, app);
}
