import { describe, expect, it } from 'vitest';
import type { KaplanMeierOptionsResponse } from '../../../src/runtime/domains';
import { createModuleClient } from '../../utils';

const options : KaplanMeierOptionsResponse = {
    entries: [
        {
            key: { code: 'OS', display: 'Overall Survival' },
            value: [{ code: 'by-tumor-entity' }, { code: 'none' }],
        },
    ],
    size: 1,
    defaults: {
        type: 'OS',
        grouping: 'none',
    },
};

describe('mtb KaplanMeierAPI', () => {
    it('should address the kaplan-meier config endpoint without a query string', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /mtb/kaplan-meier/config': () => options });

        await moduleClient.kaplanMeier.getOptions();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/kaplan-meier/config');
        expect(client.requests[0]?.url).not.toContain('?');
    });

    it('should unwrap the response body rather than the transport envelope', async () => {
        const { moduleClient } = createModuleClient({ 'GET /mtb/kaplan-meier/config': () => options });

        const response = await moduleClient.kaplanMeier.getOptions();

        expect(response.defaults).toEqual(options.defaults);
        expect(response).not.toHaveProperty('data');
        expect(response).not.toHaveProperty('status');
    });
});
