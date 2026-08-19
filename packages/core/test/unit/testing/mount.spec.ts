import { flushPromises } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';
import type { HTTPClient } from '@dnpm-dip/http-kit';
import { injectHTTPClient } from '../../../src/core';
import { mountComponent } from '../../../src/testing';

/**
 * Guards mountComponent's core value proposition: a mounted component must
 * see the FAKE client, not a real one. installHTTPClient falls through to
 * `new Client(...)` when the forwarded client is dropped, which does not
 * throw at construction — so a regressed forwarding chain (e.g. install.ts
 * losing `client: options.httpClient`) makes every component spec pass
 * while silently testing nothing. This spec fails loudly for that case.
 */
let injectedClient: HTTPClient | undefined;

const Probe = defineComponent({
    setup() {
        injectedClient = injectHTTPClient();
        injectedClient.site.getItems('mtb');

        return () => h('div');
    },
});

describe('mountComponent', () => {
    beforeEach(() => {
        injectedClient = undefined;
    });

    it('routes a component-injected request through the fake client', async () => {
        const { client } = mountComponent(Probe, {}, { 'GET /mtb/sites': () => ({ local: { code: 'site-a' }, others: [] }) });

        await flushPromises();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
    });

    it('provides the same client instance the harness returns', () => {
        const { client } = mountComponent(Probe, {}, { 'GET /mtb/sites': () => ({ local: { code: 'site-a' }, others: [] }) });

        expect(injectedClient).toBe(client);
    });
});
