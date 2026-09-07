import { describe, expect, it } from 'vitest';
import { isDistributionQuantities } from '../../../src/domains';

describe('isDistributionQuantities', () => {
    it('should accept a distribution with a total and an element list', () => {
        const input = {
            total: 2,
            elements: [{ key: { code: 'male' }, value: 1 }, { key: { code: 'female' }, value: 1 }],
        };

        expect(isDistributionQuantities(input)).toBe(true);
    });

    it('should accept an empty element list', () => {
        expect(isDistributionQuantities({ total: 0, elements: [] })).toBe(true);
    });

    it('should reject a distribution without a numeric total', () => {
        expect(isDistributionQuantities({ elements: [] })).toBe(false);
        expect(isDistributionQuantities({ total: '2', elements: [] })).toBe(false);
    });

    it('should reject a distribution whose elements are not a list', () => {
        expect(isDistributionQuantities({ total: 2, elements: { key: 'male', value: 1 } })).toBe(false);
    });

    it('should reject non records', () => {
        expect(isDistributionQuantities(undefined)).toBe(false);
        expect(isDistributionQuantities(null)).toBe(false);
        expect(isDistributionQuantities([])).toBe(false);
    });

    it('should not inspect the element shape, so a concept count distribution also passes', () => {
        const input = {
            total: 1,
            elements: [{ key: { code: 'male' }, value: { count: 1, percent: 100 } }],
        };

        expect(isDistributionQuantities(input)).toBe(true);
    });
});
