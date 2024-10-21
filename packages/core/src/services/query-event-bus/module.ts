/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { EventEmitter } from '@posva/event-emitter';
import type { QueryEventBus, QueryEventBusEvents } from './types';

export function createQueryEventBus() : QueryEventBus {
    return new EventEmitter<QueryEventBusEvents>();
}
