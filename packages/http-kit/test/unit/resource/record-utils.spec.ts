import { describe, expect, it } from 'vitest';
import { defineResourceRecordEvents } from '../../../src/resource';

type Item = { id: string };

describe('defineResourceRecordEvents', () => {
    it('should declare the record lifecycle events', () => {
        const events = defineResourceRecordEvents<Item>();

        expect(Object.keys(events).sort()).toEqual(['created', 'deleted', 'failed', 'resolved', 'updated']);
    });

    it('should accept every payload it validates', () => {
        const events = defineResourceRecordEvents<Item>();

        expect(events.failed(new Error('boom'))).toBe(true);
        expect(events.created({ id: 'a' })).toBe(true);
        expect(events.deleted({ id: 'a' })).toBe(true);
        expect(events.updated({ id: 'a' })).toBe(true);
        expect(events.resolved({ id: 'a' })).toBe(true);
    });

    it('should accept a resolved event without a payload', () => {
        const events = defineResourceRecordEvents<Item>();

        expect(events.resolved()).toBe(true);
    });

    it('should hand out a fresh declaration on every call', () => {
        expect(defineResourceRecordEvents<Item>()).not.toBe(defineResourceRecordEvents<Item>());
    });
});
