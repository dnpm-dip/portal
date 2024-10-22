/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { EventEmitter } from '@posva/event-emitter';
import type { QueryBase } from '../../domains';
import type { QueryEventBusEventName } from './constants';

export type QueryEventBusEvents = {
    [QueryEventBusEventName.SESSION_UPDATED]: [QueryBase<any>, string | null],
    [QueryEventBusEventName.SESSION_EXPIRING]: [QueryBase<any>, string | null],
    [QueryEventBusEventName.SESSION_EXPIRED]: [QueryBase<any>, string | null],
    [QueryEventBusEventName.SESSION_REFRESH_FAILED]: [QueryBase<any>, string | null],

    [QueryEventBusEventName.FILTER_UPDATED]: [string],
    [QueryEventBusEventName.FILTERS_COMMITED]: [],
};

export type QueryEventBus = EventEmitter<QueryEventBusEvents>;
