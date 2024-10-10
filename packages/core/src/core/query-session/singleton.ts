/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Pinia } from 'pinia';
import type { App } from 'vue';
import { inject } from '../inject';
import { provide } from '../provide';
import type { QuerySessionStore, QuerySessionStoreDefinition } from './types';

export const StoreSymbol = Symbol.for('QuerySessionStore');

export function useQuerySessionStore(pinia?: Pinia, app?: App) : QuerySessionStore {
    const instance = injectQuerySessionStore(app);
    if (!instance) {
        throw new Error('The store has not been injected in the app context.');
    }

    return instance(pinia);
}

export function injectQuerySessionStore(app?: App) : QuerySessionStoreDefinition {
    const instance = inject<QuerySessionStoreDefinition>(StoreSymbol, app);
    if (!instance) {
        throw new Error('The store has not been injected in the app context.');
    }

    return instance;
}

export function hasQuerySessionStore(app?: App) : boolean {
    return !!inject(StoreSymbol, app);
}

export function provideQuerySessionStore(
    store: QuerySessionStoreDefinition,
    app?: App,
) {
    provide(StoreSymbol, store, app);
}
