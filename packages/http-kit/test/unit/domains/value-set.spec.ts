import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('ValueSetAPI', () => {
    it('should read the value set collection', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => ({ entries: [], size: 0 }) } });

        await client.valueSet.getMany();

        expect(client.requests[0]?.url).toContain('/coding/valuesets');
    });

    it('should omit the version parameter when none is given', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => ({ entries: [], size: 0 }) } });

        await client.valueSet.getOne('urn:vs');

        expect(client.requests[0]?.url).not.toContain('version=');
    });

    it('should include the version parameter when given', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => ({ entries: [], size: 0 }) } });

        await client.valueSet.getOne('urn:vs', '2.0');

        expect(client.requests[0]?.url).toContain('version=2.0');
    });
});
