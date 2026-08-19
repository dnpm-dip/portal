import { describe, expect, it } from 'vitest';
import { ResourceCollectionSortDirection, stringifyResourceCollectionMeta } from '../../../src/resource';

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
});
