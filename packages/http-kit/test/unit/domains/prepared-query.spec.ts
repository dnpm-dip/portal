import { describe, expect, it } from 'vitest';
import type { PreparedQuery } from '../../../src/domains';
import { PreparedQueryAPI } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

const preparedQuery : PreparedQuery = {
    id: 'pq-1',
    name: 'Neu',
    criteria: { diagnoses: [{ code: 'C25.0' }] },
};

describe('PreparedQueryAPI', () => {
    it('should scope every route by the use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/prepared-queries': () => ({ entries: [preparedQuery], size: 1 }) } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        const response = await api.getMany();

        expect(client.requests[0]?.url).toContain('/mtb/prepared-queries');
        expect(response.entries[0]?.id).toBe('pq-1');
    });

    it('should default a missing name to a timestamp on create', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/prepared-queries': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.create({ criteria: {} });

        const body = client.requests[0]?.body as { name?: string };
        expect(body.name).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should keep a supplied name untouched on create', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/prepared-queries': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.create({ name: 'Meine Abfrage', criteria: {} });

        expect((client.requests[0]?.body as { name?: string }).name).toBe('Meine Abfrage');
    });

    it('should patch on update', async () => {
        const client = createFakeClient({ handlers: { 'PATCH /mtb/prepared-queries/:id': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.update('pq-1', { name: 'Neu', criteria: {} });

        expect(client.requests[0]?.method).toBe('PATCH');
        expect(client.requests[0]?.params).toEqual({ id: 'pq-1' });
        expect(client.requests[0]?.body).toEqual({ name: 'Neu', criteria: {} });
    });

    it('should post the criteria on create', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/prepared-queries': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        const response = await api.create({ name: 'Neu', criteria: { diagnoses: [{ code: 'C25.0' }] } });

        expect(client.requests[0]?.method).toBe('POST');
        expect(client.requests[0]?.url).toContain('/mtb/prepared-queries');
        expect(client.requests[0]?.body).toEqual({ name: 'Neu', criteria: { diagnoses: [{ code: 'C25.0' }] } });
        expect(response.criteria).toEqual({ diagnoses: [{ code: 'C25.0' }] });
    });

    it('should default a missing name to a timestamp on update as well', async () => {
        const client = createFakeClient({ handlers: { 'PATCH /mtb/prepared-queries/:id': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.update('pq-1', { criteria: {} });

        expect((client.requests[0]?.body as { name?: string }).name).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should read one prepared query by id', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/prepared-queries/:id': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        const response = await api.getOne('pq-1');

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/prepared-queries/pq-1');
        expect(client.requests[0]?.params).toEqual({ id: 'pq-1' });
        expect(response.name).toBe('Neu');
    });

    it('should delete one prepared query by id', async () => {
        const client = createFakeClient({ handlers: { 'DELETE /mtb/prepared-queries/:id': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        const response = await api.delete('pq-1');

        expect(client.requests[0]?.method).toBe('DELETE');
        expect(client.requests[0]?.params).toEqual({ id: 'pq-1' });
        expect(response.name).toBe('Neu');
    });

    it('should scope every route by a different use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /rd/prepared-queries/:id': () => preparedQuery } });
        const api = new PreparedQueryAPI({ client, useCase: 'rd' });

        await api.getOne('pq-1');

        expect(client.requests[0]?.url).toContain('/rd/prepared-queries/pq-1');
    });
});
