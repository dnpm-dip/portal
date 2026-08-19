/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Pinia } from 'pinia';
import type { App } from 'vue';
import { inject, provide } from '../../core';
import type { QueryFilterStore, QueryFilterStoreDefinition } from './types';

const StoreSymbol = Symbol.for('QueryFilterStore');

export function useQueryFilterStore(pinia?: Pinia, app?: App) : QueryFilterStore {
    const instance = injectQueryFilterStore(app);
    if (!instance) {
        throw new Error('The store has not been injected in the app context.');
    }

    return instance(pinia);
}

export function injectQueryFilterStore(app?: App) : QueryFilterStoreDefinition {
    const instance = inject<QueryFilterStoreDefinition>(StoreSymbol, app);
    if (!instance) {
        throw new Error('The store has not been injected in the app context.');
    }

    return instance;
}

export function hasQueryFilterStore(app?: App) : boolean {
    return !!inject(StoreSymbol, app);
}

export function provideQueryFilterStore(
    store: QueryFilterStoreDefinition,
    app?: App,
) {
    provide(StoreSymbol, store, app);
}
