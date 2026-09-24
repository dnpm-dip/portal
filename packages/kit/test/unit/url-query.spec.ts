import { describe, expect, it } from 'vitest';
import { serializeURLQueryRecord } from '../../src';

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

    it('should percent-encode values so a literal + survives as %2B', () => {
        const qs = serializeURLQueryRecord({ therapy: { medication: 'L01XX|atc+L01EX|atc' } });
        expect(qs).toBe('therapy[medication]=L01XX%7Catc%2BL01EX%7Catc');
        expect(new URLSearchParams(qs).get('therapy[medication]')).toBe('L01XX|atc+L01EX|atc');
    });
});
