import { describe, expect, it } from 'vitest';
import { HTTPClient } from '../../../src/client';
import type { PatientFilter, QueryBase, SiteResponse } from '../../../src/domains';
import {
    CodeSystemAPI,
    QueryAPI,
    SiteAPI,
    ValueSetAPI,
} from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

const site : SiteResponse = {
    local: { code: 'site-a' },
    others: [],
};

const query : QueryBase = {
    id: 'q-1',
    submittedAt: '2024-01-01T10:00:00Z',
    querier: 'dr-mustermann',
    mode: { code: 'local' },
    expiresAfter: 900,
    lastUpdate: '2024-01-01T10:05:00Z',
    peers: [],
};

const patientFilter : PatientFilter = { gender: [{ code: 'male' }] };

describe('HTTPClient', () => {
    it('should expose one api instance per bundled domain', () => {
        const client = new HTTPClient();

        expect(client.codeSystem).toBeInstanceOf(CodeSystemAPI);
        expect(client.query).toBeInstanceOf(QueryAPI);
        expect(client.site).toBeInstanceOf(SiteAPI);
        expect(client.valueSet).toBeInstanceOf(ValueSetAPI);
    });

    it('should build every bundled domain route relative to the client base url', async () => {
        const client = createFakeClient({
            baseURL: 'http://portal.test/api/',
            handlers: {
                'GET /api/mtb/sites': () => site,
                'GET /api/mtb/queries/:id': () => query,
                'GET /api/mtb/queries/:id/filters/patient': () => patientFilter,
                'GET /api/coding/codesystems': () => ({ entries: [], size: 0 }),
                'GET /api/coding/valuesets': () => ({ entries: [], size: 0 }),
            },
        });

        await client.site.getItems('mtb');
        await client.query.getOne('mtb', 'q-1');
        await client.query.getPatientFilter('mtb', 'q-1');
        await client.codeSystem.getMany();
        await client.valueSet.getMany();

        expect(client.requests.map((request) => request.url)).toEqual([
            'http://portal.test/api/mtb/sites',
            'http://portal.test/api/mtb/queries/q-1',
            'http://portal.test/api/mtb/queries/q-1/filters/patient',
            'http://portal.test/api/coding/codesystems',
            'http://portal.test/api/coding/valuesets',
        ]);
    });
});
