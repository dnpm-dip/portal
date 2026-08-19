import { describe, expect, it } from 'vitest';
import { createModuleClient } from '../../utils';

describe('rd QueryAPI', () => {
    it('should default the request mode to local on submit', async () => {
        const { client, moduleClient } = createModuleClient({
            'POST /rd/queries': () => ({
                id: 'q-1',
                submittedAt: '2026-01-01T00:00:00Z',
                querier: 'querier-1',
                mode: { code: 'local' },
                criteria: { diagnoses: [] },
                expiresAfter: 3600,
                lastUpdate: '2026-01-01T00:00:00Z',
                peers: [],
            }),
        });

        await moduleClient.query.submit({} as any);

        expect(client.requests[0]?.body).toMatchObject({ mode: { code: 'local' } });
    });

    it('should address the patient-matches endpoint with pagination', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/patient-matches': () => ({ entries: [], size: 0 }) });

        await moduleClient.query.getPatients('q-1', { limit: 10, offset: 0 });

        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/patient-matches');
        expect(client.requests[0]?.url).toContain('limit=10');
    });

    it('should append the demographics query string only when given', async () => {
        const { client, moduleClient } = createModuleClient({
            'GET /rd/queries/:id/demographics': () => ({
                siteDistribution: { total: 0, elements: [] },
                genderDistribution: { total: 0, elements: [] },
                ageDistribution: { total: 0, elements: [] },
            }),
        });

        await moduleClient.query.getDemographics('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });
});
