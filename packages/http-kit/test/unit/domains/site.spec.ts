import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('SiteAPI', () => {
    it('should address the use-case scoped sites endpoint', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/sites': () => ({
                    local: { code: 'site-a', display: 'Standort A' },
                    others: [{ code: 'site-b', display: 'Standort B' }],
                }),
            },
        });

        const response = await client.site.getItems('mtb');

        expect(client.requests[0]?.url).toContain('/mtb/sites');
        expect(response.local.code).toBe('site-a');
        expect(response.others).toHaveLength(1);
    });

    it('should scope by the given use case', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /rd/sites': () => ({
                    local: { code: 'site-a', display: 'Standort A' },
                    others: [],
                }),
            },
        });

        await client.site.getItems('rd');

        expect(client.requests[0]?.url).toContain('/rd/sites');
    });
});
