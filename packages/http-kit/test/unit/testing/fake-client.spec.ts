import { isClientError } from 'hapic';
import { describe, expect, it } from 'vitest';
import { createFakeClient, fakeResponse } from '../../../src/testing';

describe('FakeClient', () => {
    it('should answer a routed request and record it', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/sites': () => ({
                    local: { code: 'site-a' },
                    others: [],
                }),
            },
        });

        const response = await client.site.getItems('mtb');

        expect(response.local).toEqual({ code: 'site-a' });
        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
    });

    it('should expose captured route parameters', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/queries/:id': (request) => ({ id: request.params.id }) } });

        const { data } = await client.get('mtb/queries/abc');

        expect(client.requests[0]?.params).toEqual({ id: 'abc' });
        expect(data).toEqual({ id: 'abc' });
    });

    it('should default to an empty portal collection when nothing matches', async () => {
        const client = createFakeClient();

        const response = await client.valueSet.getMany();

        expect(response).toEqual({ entries: [], size: 0 });
    });

    it('should prefer a custom fallback over the default one', async () => {
        const client = createFakeClient({
            handlers: { 'GET /coding/codesystems': () => ({ entries: [], size: 0 }) },
            fallback: () => ({ entries: [], size: 7 }),
        });

        const response = await client.valueSet.getMany();

        expect(response.size).toBe(7);
        expect(client.requests[0]?.params).toEqual({});
    });

    it('should drive a non-2xx through the real hapic error pipeline', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/sites': () => fakeResponse(500, { issues: [{ severity: 'error', details: 'boom' }] }) } });

        await expect(client.site.getItems('mtb')).rejects.toSatisfy(isClientError);
    });

    it('should parse a JSON request body back out', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/queries': () => ({ id: 'created' }) } });

        await client.post('mtb/queries', { mode: { code: 'local' } });

        expect(client.requests[0]?.body).toEqual({ mode: { code: 'local' } });
        expect(client.requests[0]?.headers['content-type']).toBe('application/json');
    });

    it('should normalize a url encoded request body into a record', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/queries': () => ({ id: 'created' }) } });

        await client.post('mtb/queries', new URLSearchParams({ mode: 'local' }));

        expect(client.requests[0]?.body).toEqual({ mode: 'local' });
    });

    it('should keep an unparsable request body as a string', async () => {
        const client = createFakeClient({ handlers: { 'POST /mtb/queries': () => ({ id: 'created' }) } });

        await client.post('mtb/queries', 'not json');

        expect(client.requests[0]?.body).toBe('not json');
    });
});
