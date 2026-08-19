import { describe, expect, it } from 'vitest';
import { PreparedQueryAPI } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

describe('PreparedQueryAPI', () => {
    it('should scope every route by the use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/prepared-queries': () => ({ entries: [], size: 0 }) } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.getMany();

        expect(client.requests[0]?.url).toContain('/mtb/prepared-queries');
    });

    it('should default a missing name to a timestamp on create', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/prepared-queries': () => ({ id: 'pq-1' }) } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.create({} as any);

        const body = client.requests[0]?.body as { name?: string };
        expect(body.name).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should keep a supplied name untouched on create', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/prepared-queries': () => ({ id: 'pq-1' }) } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.create({ name: 'Meine Abfrage' } as any);

        expect((client.requests[0]?.body as { name?: string }).name).toBe('Meine Abfrage');
    });

    it('should patch on update', async () => {
        const client = createFakeClient({ handlers: { 'PATCH /mtb/prepared-queries/:id': () => ({ id: 'pq-1' }) } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.update('pq-1', { name: 'Neu' } as any);

        expect(client.requests[0]?.method).toBe('PATCH');
        expect(client.requests[0]?.params).toEqual({ id: 'pq-1' });
    });
});
