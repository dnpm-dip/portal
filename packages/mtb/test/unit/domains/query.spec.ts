import { describe, expect, it } from 'vitest';
import { createModuleClient } from '../../utils';

describe('mtb QueryAPI', () => {
    it('should default the request mode to local on submit', async () => {
        const { client, moduleClient } = createModuleClient({ 'POST /mtb/queries': () => ({ id: 'q-1' }) });

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
        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/survival-statistics': () => ({ data: [] }) });

        await moduleClient.query.getKaplanMeierStatistics('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });
});
