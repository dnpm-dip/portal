import { describe, expect, it } from 'vitest';
import type { ValueSet } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

const valueSet : ValueSet = {
    name: 'gender',
    title: 'Geschlecht',
    uri: 'urn:vs',
    date: '2024-01-01',
    codings: [{
        code: 'male',
        display: 'männlich',
        system: 'urn:gender',
        version: '1.0',
    }],
};

describe('ValueSetAPI', () => {
    it('should read the value set collection', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => ({ entries: [], size: 0 }) } });

        await client.valueSet.getMany();

        expect(client.requests[0]?.url).toContain('/coding/valuesets');
    });

    it('should omit the version parameter when none is given', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => valueSet } });

        await client.valueSet.getOne('urn:vs');

        expect(client.requests[0]?.url).toMatch(/\/coding\/valuesets\?uri=urn:vs$/);
    });

    it('should include the version parameter when given', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => valueSet } });

        await client.valueSet.getOne('urn:vs', '2.0');

        expect(client.requests[0]?.url).toContain('/coding/valuesets?uri=urn:vs&version=2.0');
    });

    it('should repeat the filter parameter once per value', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => valueSet } });

        await client.valueSet.getOne('urn:vs', undefined, ['a', 'b']);

        expect(client.requests[0]?.url).toContain('/coding/valuesets?uri=urn:vs&filter=a&filter=b');
    });

    it('should omit the filter parameter for an empty filter list', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => valueSet } });

        await client.valueSet.getOne('urn:vs', undefined, []);

        expect(client.requests[0]?.url).toMatch(/\/coding\/valuesets\?uri=urn:vs$/);
    });

    it('should unwrap the value set record', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => valueSet } });

        const response = await client.valueSet.getOne('urn:vs');

        expect(response.uri).toBe('urn:vs');
        expect(response.codings?.[0]?.code).toBe('male');
    });

    it('should unwrap the value set collection', async () => {
        const client = createFakeClient({ handlers: { 'GET /coding/valuesets': () => ({ entries: [valueSet], size: 1 }) } });

        const response = await client.valueSet.getMany();

        expect(response.size).toBe(1);
        expect(response.entries[0]?.uri).toBe('urn:vs');
    });
});
