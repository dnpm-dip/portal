import { describe, expect, it } from 'vitest';
import {
    ResourceCollectionSortDirection,
    defineResourceCollectionEvents,
    stringifyResourceCollectionMeta,
} from '../../../src/resource';

describe('stringifyResourceCollectionMeta', () => {
    it('should return an empty string for empty meta', () => {
        expect(stringifyResourceCollectionMeta({})).toBe('');
    });

    it('should serialize limit and offset', () => {
        const output = stringifyResourceCollectionMeta({ limit: 10, offset: 20 });

        expect(output.startsWith('?')).toBe(true);
        expect(output).toContain('limit=10');
        expect(output).toContain('offset=20');
    });

    it('should prefix a descending sort key with a minus', () => {
        const output = stringifyResourceCollectionMeta({ sort: { createdAt: ResourceCollectionSortDirection.DESC } });

        expect(output).toContain('sort=-createdAt');
    });

    it('should leave an ascending sort key bare', () => {
        const output = stringifyResourceCollectionMeta({ sort: { createdAt: ResourceCollectionSortDirection.ASC } });

        expect(output).toContain('sort=createdAt');
    });

    it('should join multiple sort keys with a comma', () => {
        const output = stringifyResourceCollectionMeta({
            sort: {
                createdAt: ResourceCollectionSortDirection.DESC,
                name: ResourceCollectionSortDirection.ASC,
            },
        });

        expect(output).toContain('sort=-createdAt,name');
    });

    it('should spread filters into top level query parameters', () => {
        const output = stringifyResourceCollectionMeta({ filters: { name: 'Abfrage' }, limit: 10 });

        expect(output).toContain('name=Abfrage');
        expect(output).toContain('limit=10');
    });

    it('should bracket a nested filter record', () => {
        const output = stringifyResourceCollectionMeta({ filters: { name: { like: 'Abfr' } } });

        expect(output).toBe('?name[like]=Abfr');
    });

    it('should repeat a filter parameter per list entry', () => {
        const output = stringifyResourceCollectionMeta({ filters: { site: ['site-a', 'site-b'] } });

        expect(output).toBe('?site=site-a&site=site-b');
    });

    it('should return an empty string when no meta is given at all', () => {
        expect(stringifyResourceCollectionMeta()).toBe('');
    });
});

describe('defineResourceCollectionEvents', () => {
    it('should declare the collection lifecycle events', () => {
        const events = defineResourceCollectionEvents<{ id: string }>();

        expect(Object.keys(events).sort()).toEqual(['created', 'deleted', 'failed', 'updated']);
    });

    it('should not declare a resolved event', () => {
        expect(defineResourceCollectionEvents<{ id: string }>()).not.toHaveProperty('resolved');
    });

    it('should accept every payload it validates', () => {
        const events = defineResourceCollectionEvents<{ id: string }>();

        expect(events.failed(new Error('boom'))).toBe(true);
        expect(events.created({ id: 'a' })).toBe(true);
        expect(events.deleted({ id: 'a' })).toBe(true);
        expect(events.updated({ id: 'a' })).toBe(true);
    });

    it('should hand out a fresh declaration on every call', () => {
        expect(defineResourceCollectionEvents()).not.toBe(defineResourceCollectionEvents());
    });
});
