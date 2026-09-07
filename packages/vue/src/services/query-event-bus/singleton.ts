/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { App } from 'vue';
import { inject, provide } from '../../core';
import type { QueryEventBus } from './types';

const sym = Symbol.for('QueryEventBus');

export function injectQueryEventBus(app?: App) : QueryEventBus {
    const instance = inject<QueryEventBus>(sym, app);
    if (!instance) {
        throw new Error('The store event bus has not been injected in the app context.');
    }

    return instance;
}

export function provideQueryEventBus(eventBus: QueryEventBus, app?: App) {
    provide(sym, eventBus, app);
}
