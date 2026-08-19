import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('QueryAPI', () => {
    it('should read one query by id', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/queries/:id': (request) => ({ id: request.params.id }) } });

        const response = await client.query.getOne('mtb', 'q-1');

        expect(response.id).toBe('q-1');
    });

    it('should read the patient filter of a query', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/queries/:id/filters/patient': () => ({ gender: [{ code: 'male' }] }) } });

        await client.query.getPatientFilter('mtb', 'q-1');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/filters/patient');
    });
});
