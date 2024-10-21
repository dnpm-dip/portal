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

import type { createQueryFilterStore } from './module';

type StoreData = ReturnType<typeof createQueryFilterStore>;
export type QueryFilterStore = BaseStore<
string,
_ExtractStateFromSetupStore<StoreData>,
_ExtractGettersFromSetupStore<StoreData>,
_ExtractActionsFromSetupStore<StoreData>
>;

export type QueryFilterStoreDefinition = BaseStoreDefinition<
string,
_ExtractStateFromSetupStore<StoreData>,
_ExtractGettersFromSetupStore<StoreData>,
_ExtractActionsFromSetupStore<StoreData>
>;

export type QueryFilterStoreInstallOptions = {
    pinia?: Pinia
};
