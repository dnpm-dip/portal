import { isClient } from 'hapic';
import type { IClient } from 'hapic';
import { describe, expect, it } from 'vitest';
import { BaseAPI } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

class ExposedAPI extends BaseAPI {
    getClient() : IClient {
        return this.client;
    }
}

describe('BaseAPI', () => {
    it('should create a client when no context is given', () => {
        const api = new ExposedAPI();

        expect(isClient(api.getClient())).toBe(true);
    });

    it('should adopt a given client instance instead of wrapping it', () => {
        const client = createFakeClient();
        const api = new ExposedAPI({ client });

        expect(api.getClient()).toBe(client);
    });

    it('should create a client from plain request options', () => {
        const api = new ExposedAPI({ client: { baseURL: 'http://portal.test/api/' } });
        const client = api.getClient();

        expect(isClient(client)).toBe(true);
        expect(client.getBaseURL()).toBe('http://portal.test/api/');
    });

    it('should replace the client on setClient', () => {
        const first = createFakeClient();
        const second = createFakeClient();
        const api = new ExposedAPI({ client: first });

        api.setClient(second);

        expect(api.getClient()).toBe(second);
    });
});
