import { defineComponent, h } from 'vue';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import type { QueryBase } from '@dnpm-dip/http-kit';
import type { QueryEventBus, QuerySessionStore } from '../../../src';
import { QueryEventBusEventName, injectQueryEventBus, useQuerySessionStore } from '../../../src';
import { mountComponent } from '../../../src/testing';

const query : QueryBase = {
    id: 'query-1',
    submittedAt: '2024-01-01T00:00:00.000Z',
    querier: 'tester',
    mode: { code: 'local' },
    expiresAfter: 900,
    lastUpdate: '2024-01-01T00:00:00.000Z',
    peers: [],
};

let store : QuerySessionStore;
let eventBus : QueryEventBus;

const Probe = defineComponent({
    setup() {
        store = useQuerySessionStore();
        eventBus = injectQueryEventBus();

        return () => h('div');
    },
});

describe('querySessionStore', () => {
    beforeEach(() => {
        mountComponent(Probe, {}, {});

        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should hold no session before tracking', () => {
        expect(store.session).toBeNull();
        expect(store.expireDate).toBeNull();
    });

    it('should track the query and derive the expire date from expiresAfter', () => {
        store.track(query);

        expect(store.session).toEqual(query);
        expect(store.expireDate).toEqual(new Date('2024-01-01T00:15:00.000Z'));
    });

    it('should drop the session on unTrack', () => {
        store.track(query);
        store.unTrack();

        expect(store.session).toBeNull();
    });

    it('should announce the session expiring five minutes ahead and then the expiry', () => {
        const expiring : unknown[][] = [];
        const expired : unknown[][] = [];

        eventBus.on(QueryEventBusEventName.SESSION_EXPIRING, (...args) => {
            expiring.push(args);
        });
        eventBus.on(QueryEventBusEventName.SESSION_EXPIRED, (...args) => {
            expired.push(args);
        });

        store.setUseCase('mtb');
        store.track(query);

        vi.advanceTimersByTime(600_000);
        expect(expiring).toEqual([[query, 'mtb']]);
        expect(expired).toHaveLength(0);

        vi.advanceTimersByTime(300_000);
        expect(expired).toEqual([[query, 'mtb']]);
    });

    it('should pass a null use case when none was set', () => {
        const expired : unknown[][] = [];
        eventBus.on(QueryEventBusEventName.SESSION_EXPIRED, (...args) => {
            expired.push(args);
        });

        store.track(query);
        vi.advanceTimersByTime(900_000);

        expect(expired).toEqual([[query, null]]);
    });

    it('should cancel the pending timers on unTrack', () => {
        let emissions = 0;
        eventBus.on(QueryEventBusEventName.SESSION_EXPIRING, () => {
            emissions += 1;
        });
        eventBus.on(QueryEventBusEventName.SESSION_EXPIRED, () => {
            emissions += 1;
        });

        store.track(query);
        store.unTrack();

        vi.advanceTimersByTime(900_000);

        expect(emissions).toBe(0);
    });

    it('should reschedule the timers when a second query is tracked', () => {
        const expired : unknown[][] = [];
        eventBus.on(QueryEventBusEventName.SESSION_EXPIRED, (...args) => {
            expired.push(args);
        });

        store.track(query);

        vi.advanceTimersByTime(60_000);

        const next : QueryBase = {
            ...query, 
            id: 'query-2', 
            expiresAfter: 1800, 
        };
        store.track(next);

        expect(store.expireDate).toEqual(new Date('2024-01-01T00:31:00.000Z'));

        vi.advanceTimersByTime(840_000);
        expect(expired).toHaveLength(0);

        vi.advanceTimersByTime(960_000);
        expect(expired).toEqual([[next, null]]);
    });
});
