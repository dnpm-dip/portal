import { describe, expect, it } from 'vitest';
import { isConceptCount, isMinMaxRange } from '../../../src/domains';

describe('isConceptCount', () => {
    it('should accept a key value record carrying a count and a percent', () => {
        expect(isConceptCount({ key: { code: 'male' }, value: { count: 3, percent: 42.5 } })).toBe(true);
    });

    it('should reject a plain numeric quantity', () => {
        expect(isConceptCount({ key: { code: 'male' }, value: 3 })).toBe(false);
    });

    it('should reject a value missing count or percent', () => {
        expect(isConceptCount({ key: { code: 'male' }, value: { count: 3 } })).toBe(false);
        expect(isConceptCount({ key: { code: 'male' }, value: { percent: 42.5 } })).toBe(false);
    });

    it('should reject non numeric count or percent', () => {
        expect(isConceptCount({ key: { code: 'male' }, value: { count: '3', percent: 42.5 } })).toBe(false);
    });

    it('should reject non records', () => {
        expect(isConceptCount(undefined)).toBe(false);
        expect(isConceptCount(null)).toBe(false);
        expect(isConceptCount([{ key: 'male', value: { count: 3, percent: 1 } }])).toBe(false);
    });
});

describe('isMinMaxRange', () => {
    it('should accept a numeric min max pair', () => {
        expect(isMinMaxRange({ min: 0, max: 80 })).toBe(true);
    });

    it('should accept a zero width range', () => {
        expect(isMinMaxRange({ min: 0, max: 0 })).toBe(true);
    });

    it('should reject a partial range', () => {
        expect(isMinMaxRange({ min: 0 })).toBe(false);
        expect(isMinMaxRange({ max: 80 })).toBe(false);
    });

    it('should reject non numeric bounds', () => {
        expect(isMinMaxRange({ min: '0', max: '80' })).toBe(false);
    });

    it('should reject non records', () => {
        expect(isMinMaxRange(undefined)).toBe(false);
        expect(isMinMaxRange(null)).toBe(false);
        expect(isMinMaxRange([0, 80])).toBe(false);
    });
});
