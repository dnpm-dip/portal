import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('SiteAPI', () => {
    it('should address the use-case scoped sites endpoint', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/sites': () => ({ entries: [{ code: 'a', display: 'A' }], size: 1 }) } });

        const response = await client.site.getItems('mtb');

        expect(client.requests[0]?.url).toContain('/mtb/sites');
        expect(response.entries[0]?.code).toBe('a');
    });

    it('should scope by the given use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /rd/sites': () => ({ entries: [], size: 0 }) } });

        await client.site.getItems('rd');

        expect(client.requests[0]?.url).toContain('/rd/sites');
    });
});
