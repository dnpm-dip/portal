import { describe, expect, it } from 'vitest';
import type { CodeSystem } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

const codeSystem : CodeSystem = {
    name: 'icd-10-gm',
    title: 'ICD-10-GM',
    uri: 'http://loinc.org',
    concepts: [{
        code: 'C25.0', 
        display: 'Pankreaskopf', 
        properties: {}, 
    }],
};

describe('CodeSystemAPI', () => {
    it('should read the code system collection', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/codesystems': () => ({ entries: [codeSystem], size: 1 }) } });

        const response = await client.codeSystem.getMany();

        expect(client.requests[0]?.url).toContain('/coding/codesystems');
        expect(response.entries[0]?.uri).toBe('http://loinc.org');
        expect(response.size).toBe(1);
    });

    it('should address one code system by uri, not by path segment', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/codesystems': () => codeSystem } });

        const response = await client.codeSystem.getOne('http://loinc.org');

        expect(client.requests[0]?.url).toContain('/coding/codesystems?uri=http://loinc.org');
        expect(response.concepts?.[0]?.code).toBe('C25.0');
    });

    it('should repeat the filter parameter once per value', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/codesystems': () => codeSystem } });

        await client.codeSystem.getOne('http://loinc.org', ['a', 'b']);

        expect(client.requests[0]?.url).toContain('/coding/codesystems?uri=http://loinc.org&filter=a&filter=b');
    });

    it('should omit the filter parameter for an empty filter list', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/codesystems': () => codeSystem } });

        await client.codeSystem.getOne('http://loinc.org', []);

        expect(client.requests[0]?.url).toContain('/coding/codesystems?uri=http://loinc.org');
        expect(client.requests[0]?.url).not.toContain('filter=');
    });
});
