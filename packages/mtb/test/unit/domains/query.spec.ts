import { describe, expect, it } from 'vitest';
import { createModuleClient } from '../../utils';

describe('mtb QueryAPI', () => {
    it('should default the request mode to local on submit', async () => {
        const { client, moduleClient } = createModuleClient({
            'POST /mtb/queries': () => ({
                id: 'q-1',
                submittedAt: '2026-01-01T00:00:00Z',
                querier: 'querier-1',
                mode: { code: 'local' },
                criteria: {},
                expiresAfter: 3600,
                lastUpdate: '2026-01-01T00:00:00Z',
                peers: [],
            }),
        });

        await moduleClient.query.submit({} as any);

        expect(client.requests[0]?.body).toMatchObject({ mode: { code: 'local' } });
    });

    it('should address the patient-matches endpoint with pagination', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/patient-matches': () => ({ entries: [], size: 0 }) });

        await moduleClient.query.getPatients('q-1', { limit: 10, offset: 0 });

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/patient-matches');
        expect(client.requests[0]?.url).toContain('limit=10');
    });

    it('should append the survival-statistics query string only when given', async () => {
        const { client, moduleClient } = createModuleClient({
            'GET /mtb/queries/:id/survival-statistics': () => ({
                data: [],
                grouping: { code: 'none' },
                survivalType: { code: 'overall' },
            }),
        });

        await moduleClient.query.getKaplanMeierStatistics('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });
});
