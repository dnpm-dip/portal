/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ref } from 'vue';
import type { QueryBase } from '../../domains';
import { QueryEventBusEventName } from '../../services/query-event-bus/constants';
import type { StoreCreateOptions } from '../types';

export function createQuerySessionStore(ctx: StoreCreateOptions) {
    const session = ref<QueryBase | null>(null);
    const useCase = ref<null | string>(null);
    const expireDate = ref<Date | null>(null);

    let expiringTimeout : ReturnType<typeof setTimeout> | undefined;
    let expiredTimeout : ReturnType<typeof setTimeout> | undefined;

    const setUseCase = (input: string | null) => {
        useCase.value = input;
    };

    const track = (input: QueryBase) => {
        clearTimeout(expiringTimeout);
        clearTimeout(expiredTimeout);

        const expiresMS = input.expiresAfter * 1000;
        expireDate.value = new Date(Date.now() + expiresMS);

        expiringTimeout = setTimeout(() => {
            ctx.queryEventBus.emit(QueryEventBusEventName.SESSION_EXPIRING, {
                session: input,
                useCase: useCase.value,
            });
        }, expiresMS - 30_000);

        expiredTimeout = setTimeout(() => {
            ctx.queryEventBus.emit(QueryEventBusEventName.SESSION_EXPIRED, {
                session: input,
                useCase: useCase.value,
            });
        }, expiresMS);

        session.value = input;
    };

    const unTrack = () => {
        session.value = null;

        clearTimeout(expiringTimeout);
        clearTimeout(expiredTimeout);
    };

    return {
        track,
        unTrack,
        setUseCase,
        expireDate,
        session,
    };
}
