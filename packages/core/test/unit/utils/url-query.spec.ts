import { describe, expect, it } from 'vitest';
import { serializeURLQueryRecord } from '../../../src/utils/url-query';

describe('serializeURLQueryRecord', () => {
    it('should serialize a flat record', () => {
        expect(serializeURLQueryRecord({ a: 'x', b: 2 })).toBe('a=x&b=2');
    });

    it('should repeat the key once per array item', () => {
        expect(serializeURLQueryRecord({ tags: ['a', 'b'] })).toBe('tags=a&tags=b');
    });

    it('should return an empty string for an empty record', () => {
        expect(serializeURLQueryRecord({})).toBe('');
    });
});
