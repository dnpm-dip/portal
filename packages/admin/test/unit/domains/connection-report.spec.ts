import { extractAPIClientErrorIssues } from '@dnpm-dip/http-kit';
import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import { isClientError } from 'hapic';
import { describe, expect, it } from 'vitest';
import type { ConnectionReport } from '../../../src/runtime/domains';
import { createModuleClient } from '../../utils';

const report : ConnectionReport = {
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
};

describe('admin AdminHTTPClient', () => {
    it('should unwrap the response body instead of resolving the transport envelope', async () => {
        const { moduleClient } = createModuleClient({ 'GET /admin/connection-report': () => report });

        const data = await moduleClient.getConnectionReport();

        expect(data).toEqual(report);
        expect(data).not.toHaveProperty('data');
        expect(data).not.toHaveProperty('status');
    });

    it('should address the connection-report endpoint once, without query string or body', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /admin/connection-report': () => report });

        await moduleClient.getConnectionReport();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toMatch(/^https?:\/\/[^/]+\/admin\/connection-report$/);
        expect(client.requests[0]?.body).toBeUndefined();
    });

    it('should reject with a client error carrying the API issues when the report request fails', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /admin/connection-report': () => fakeResponse(500, { issues: [{ severity: 'error', details: 'peer registry unreachable' }] }) });

        const error = await moduleClient.getConnectionReport()
            .then(() => undefined)
            .catch((e) => e);

        expect(isClientError(error)).toBe(true);
        expect(extractAPIClientErrorIssues(error)).toEqual([
            { severity: 'error', details: 'peer registry unreachable' },
        ]);
        expect(client.requests).toHaveLength(1);
    });
});
