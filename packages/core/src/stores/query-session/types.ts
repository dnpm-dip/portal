/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    Store as BaseStore,
    StoreDefinition as BaseStoreDefinition,
    Pinia,
    _ExtractActionsFromSetupStore,
    _ExtractGettersFromSetupStore, _ExtractStateFromSetupStore,
} from 'pinia';

import type { createQuerySessionStore } from './module';

type StoreData = ReturnType<typeof createQuerySessionStore>;
export type QuerySessionStore = BaseStore<
string,
_ExtractStateFromSetupStore<StoreData>,
_ExtractGettersFromSetupStore<StoreData>,
_ExtractActionsFromSetupStore<StoreData>
>;

export type QuerySessionStoreDefinition = BaseStoreDefinition<
string,
_ExtractStateFromSetupStore<StoreData>,
_ExtractGettersFromSetupStore<StoreData>,
_ExtractActionsFromSetupStore<StoreData>
>;

export type QuerySessionStoreInstallOptions = {
    pinia?: Pinia
};
