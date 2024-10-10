/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { EventEmitter } from '@posva/event-emitter';
import { ref } from 'vue';
import type { QueryBase } from '../../domains';

type EventContext = {
    session: QueryBase,
    useCase: string | null
};

export function createQuerySessionStore() {
    const eventEmitter = new EventEmitter<{
        tracked: EventContext,
        refreshFailed: [],
        untracked: EventContext,
        expiring: EventContext,
        expired: EventContext,
    }>();

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
            eventEmitter.emit('expiring', {
                session: input,
                useCase: useCase.value,
            });
        }, expiresMS - 30_000);

        expiredTimeout = setTimeout(() => {
            eventEmitter.emit('expired', {
                session: input,
                useCase: useCase.value,
            });
        }, expiresMS);

        session.value = input;
    };

    const unTrack = () => {
        if (session.value) {
            eventEmitter.emit('untracked', {
                session: session.value,
                useCase: useCase.value,
            });
        }

        session.value = null;

        clearTimeout(expiringTimeout);
        clearTimeout(expiredTimeout);
    };

    return {
        track,
        unTrack,
        setUseCase,
        expireDate,
        eventEmitter,
        session,
    };
}
