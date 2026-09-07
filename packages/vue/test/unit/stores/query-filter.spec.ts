import { defineComponent, h } from 'vue';
import { 
    beforeEach, 
    describe, 
    expect, 
    it, 
} from 'vitest';
import type { Coding, CodingGroup } from '@dnpm-dip/http-kit';
import type { QueryEventBus, QueryFilterStore } from '../../../src';
import {
    QueryEventBusEventName,
    buildQueryFilterURLValue,
    buildQueryFiltersURLRecord,
    injectQueryEventBus,
    useQueryFilterStore,
} from '../../../src';
import { mountComponent } from '../../../src/testing';

const female : Coding = {
    code: 'female', 
    system: 'Gender', 
    display: 'Weiblich', 
};
const male : Coding = { code: 'male', system: 'Gender' };
const group : CodingGroup = { id: 'a::b', children: [{ code: 'a' }, { code: 'b' }] };

let store : QueryFilterStore;
let eventBus : QueryEventBus;

const Probe = defineComponent({
    setup() {
        store = useQueryFilterStore();
        eventBus = injectQueryEventBus();

        return () => h('div');
    },
});

describe('queryFilterStore', () => {
    beforeEach(() => {
        mountComponent(Probe, {}, {});
    });

    it('should keep items per key after setItems', () => {
        store.setItems('gender', [female]);

        expect(store.getItems('gender')).toEqual([female]);
        expect(store.hasItem('gender', female)).toBe(true);
        expect(store.hasItem('gender', male)).toBe(false);
        expect(store.hasItem('site', female)).toBe(false);
    });

    it('should clear a key when setItems receives an empty list', () => {
        store.setItems('gender', [female, male]);
        store.setItems('gender', []);

        expect(store.getItems('gender')).toEqual([]);
        expect(store.hasItem('gender', female)).toBe(false);
    });

    it('should replace instead of append on a second setItems', () => {
        store.setItems('gender', [female]);
        store.setItems('gender', [male]);

        expect(store.getItems('gender')).toEqual([male]);
    });

    it('should append a single item with addItem', () => {
        store.addItem('gender', female);
        store.addItem('gender', male);

        expect(store.getItems('gender')).toEqual([female, male]);
    });

    it('should empty every key on reset', () => {
        store.setItems('gender', [female]);
        store.setItems('site', [male]);

        store.reset();

        expect(store.items).toEqual({});
        expect(store.getItems('gender')).toEqual([]);
        expect(store.hasItem('site', male)).toBe(false);
    });

    it('should track the active filter', () => {
        expect(store.active).toBeNull();

        store.setActive('patient');
        expect(store.active).toBe('patient');

        store.resetActive();
        expect(store.active).toBeNull();
    });

    it('should become dirty on a changed setItems and clean again on commit', () => {
        expect(store.dirty).toBe(false);

        store.setItems('gender', [female]);
        expect(store.dirty).toBe(true);

        store.commit();
        expect(store.dirty).toBe(false);
    });

    it('should stay clean when setItems does not change the items', () => {
        store.setItems('gender', [female]);
        store.commit();

        store.setItems('gender', [female]);

        expect(store.dirty).toBe(false);
    });

    it('should announce filter changes and commits on the query event bus', () => {
        const updated : string[] = [];
        let commits = 0;

        eventBus.on(QueryEventBusEventName.FILTER_UPDATED, (key) => {
            updated.push(key);
        });
        eventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => {
            commits += 1;
        });

        store.setItems('gender', [female]);
        store.setItems('site', []);
        store.commit();

        expect(updated).toEqual(['gender', 'site']);
        expect(commits).toBe(1);
    });

    it('should build a url record from the tracked items', () => {
        store.setItems('gender', [female]);
        store.setItems('site', [{ code: 'site-a' }]);
        store.setItems('vitalStatus', []);

        expect(store.buildURLRecord()).toEqual({
            gender: 'female|Gender',
            site: 'site-a',
        });
    });
});

describe('buildQueryFilterURLValue', () => {
    it('should serialize codings comma separated', () => {
        expect(buildQueryFilterURLValue([female, male])).toBe('female|Gender,male|Gender');
    });

    it('should serialize a coding group plus separated', () => {
        expect(buildQueryFilterURLValue([group])).toBe('a+b');
    });

    it('should return undefined for an empty list', () => {
        expect(buildQueryFilterURLValue([])).toBeUndefined();
    });
});

describe('buildQueryFiltersURLRecord', () => {
    it('should serialize every key holding a value', () => {
        expect(buildQueryFiltersURLRecord({
            gender: [female],
            site: [group],
        })).toEqual({
            gender: 'female|Gender',
            site: 'a+b',
        });
    });

    it('should omit keys without a value', () => {
        expect(buildQueryFiltersURLRecord({
            gender: [],
            site: [male],
        })).toEqual({ site: 'male|Gender' });
    });
});
