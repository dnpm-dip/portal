import { describe, expect, it } from 'vitest';
import { createModuleClient } from '../../utils';

describe('admin AdminHTTPClient', () => {
    it('should request the connection report and return the response data', async () => {
        const { client, moduleClient } = createModuleClient({
            'GET /admin/connection-report': () => ({
                peers: [
                    {
                        site: { code: 'site-a' }, 
                        status: 'online', 
                        details: 'ok', 
                    },
                ],
                self: {
                    site: { code: 'site-self' }, 
                    status: 'online', 
                    details: 'ok', 
                },
                createdAt: '2026-01-01T00:00:00Z',
            }),
        });

        const report = await moduleClient.getConnectionReport();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/admin/connection-report');
        expect(report.peers).toHaveLength(1);
        expect(report.self.status).toBe('online');
    });
});
