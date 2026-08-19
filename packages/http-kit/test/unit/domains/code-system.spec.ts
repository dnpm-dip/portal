import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('CodeSystemAPI', () => {
    it('should read the code system collection', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/codesystems': () => ({ entries: [], size: 0 }) } });

        await client.codeSystem.getMany();

        expect(client.requests[0]?.url).toContain('/coding/codesystems');
    });

    it('should address one code system by uri, not by path segment', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/codesystems': () => ({ entries: [], size: 0 }) } });

        await client.codeSystem.getOne('http://loinc.org');

        expect(client.requests[0]?.url).toContain('uri=http://loinc.org');
    });

    it('should repeat the filter parameter once per value', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/codesystems': () => ({ entries: [], size: 0 }) } });

        await client.codeSystem.getOne('http://loinc.org', ['a', 'b']);

        const url = client.requests[0]?.url ?? '';
        expect(url).toContain('filter=a');
        expect(url).toContain('filter=b');
    });
});
