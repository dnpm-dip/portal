import { describe, expect, it } from 'vitest';
import { isCodingGroup, toCodingGroup } from '../../../src/domains';

describe('isCodingGroup', () => {
    it('should accept a record with an id and a children list', () => {
        expect(isCodingGroup({ id: 'a::b', children: [{ code: 'a' }, { code: 'b' }] })).toBe(true);
    });

    it('should accept an empty children list', () => {
        expect(isCodingGroup({ id: '', children: [] })).toBe(true);
    });

    it('should reject a record without a string id', () => {
        expect(isCodingGroup({ children: [] })).toBe(false);
        expect(isCodingGroup({ id: 1, children: [] })).toBe(false);
    });

    it('should reject a record whose children are not a list', () => {
        expect(isCodingGroup({ id: 'a', children: { code: 'a' } })).toBe(false);
    });

    it('should reject non records', () => {
        expect(isCodingGroup(undefined)).toBe(false);
        expect(isCodingGroup(null)).toBe(false);
        expect(isCodingGroup([{ id: 'a', children: [] }])).toBe(false);
    });
});

describe('toCodingGroup', () => {
    it('should derive the id from the sorted codes', () => {
        const group = toCodingGroup([{ code: 'c' }, { code: 'a' }, { code: 'b' }]);

        expect(group.id).toBe('a::b::c');
    });

    it('should keep the children in their original order', () => {
        const group = toCodingGroup([{ code: 'c' }, { code: 'a' }]);

        expect(group.children.map((item) => item.code)).toEqual(['c', 'a']);
    });

    it('should produce the same id regardless of the input order', () => {
        expect(toCodingGroup([{ code: 'a' }, { code: 'b' }]).id)
            .toBe(toCodingGroup([{ code: 'b' }, { code: 'a' }]).id);
    });

    it('should stringify numeric codes', () => {
        expect(toCodingGroup([{ code: 2 }, { code: 10 }]).id).toBe('10::2');
    });

    it('should yield an empty id for no codings', () => {
        const group = toCodingGroup([]);

        expect(group.id).toBe('');
        expect(group.children).toEqual([]);
    });
});
