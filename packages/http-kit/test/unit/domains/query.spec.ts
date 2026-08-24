import { describe, expect, it } from 'vitest';
import type { PatientFilter, QueryBase } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

const query : QueryBase = {
    id: 'q-1',
    submittedAt: '2024-01-01T10:00:00Z',
    querier: 'dr-mustermann',
    mode: { code: 'local' },
    criteria: { diagnoses: [{ code: 'C25.0' }] },
    expiresAfter: 900,
    lastUpdate: '2024-01-01T10:05:00Z',
    peers: [{
        site: { code: 'site-b' }, 
        status: 'online', 
        details: 'erreichbar', 
    }],
};

const patientFilter : PatientFilter = {
    gender: [{ code: 'male' }],
    ageRange: { min: 18, max: 80 },
};

describe('QueryAPI', () => {
    it('should read one query by id and unwrap the record', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/queries/:id': () => query } });

        const response = await client.query.getOne('mtb', 'q-1');

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1');
        expect(client.requests[0]?.params).toEqual({ id: 'q-1' });
        expect(response.querier).toBe('dr-mustermann');
        expect(response.peers[0]?.site.code).toBe('site-b');
    });

    it('should scope the query route by the given use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /rd/queries/:id': () => query } });

        await client.query.getOne('rd', 'q-2');

        expect(client.requests[0]?.url).toContain('/rd/queries/q-2');
    });

    it('should read the patient filter of a query and unwrap the record', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/queries/:id/filters/patient': () => patientFilter } });

        const response = await client.query.getPatientFilter('mtb', 'q-1');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/filters/patient');
        expect(client.requests[0]?.params).toEqual({ id: 'q-1' });
        expect(response.gender?.[0]?.code).toBe('male');
        expect(response.ageRange).toEqual({ min: 18, max: 80 });
    });
});
