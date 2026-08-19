import { flushPromises } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';
import type { IAdminAPIClient } from '../../../src/runtime/core/http-client';
import { injectHTTPClient } from '../../../src/runtime/core/http-client';
import { mountModuleComponent } from '../../utils';

/**
 * Guards mountModuleComponent's core value proposition: a mounted component
 * must see the module client built ON TOP OF the fake client, not a real
 * one. mountModuleComponent provides the module client through onApp, which
 * runs before mount — a regressed forwarding chain (e.g. onApp dropping the
 * forwarded fake client, or provideHTTPClient landing after mount) makes
 * every component spec pass while silently testing nothing. This spec fails
 * loudly for that case.
 */
let injectedClient: IAdminAPIClient | undefined;

const Probe = defineComponent({
    setup() {
        injectedClient = injectHTTPClient();
        injectedClient.getConnectionReport();

        return () => h('div');
    },
});

describe('mountModuleComponent', () => {
    beforeEach(() => {
        injectedClient = undefined;
    });

    it('routes a component-injected request through the fake client', async () => {
        const { client } = mountModuleComponent(Probe, {}, {
            'GET /admin/connection-report': () => ({
                peers: [],
                self: {
                    site: { code: 'site-self' }, 
                    status: 'online', 
                    details: 'ok', 
                },
                createdAt: '2026-01-01T00:00:00Z',
            }),
        });

        await flushPromises();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
    });

    it('provides the same module client instance the harness returns', () => {
        const { moduleClient } = mountModuleComponent(Probe, {}, {
            'GET /admin/connection-report': () => ({
                peers: [],
                self: {
                    site: { code: 'site-self' }, 
                    status: 'online', 
                    details: 'ok', 
                },
                createdAt: '2026-01-01T00:00:00Z',
            }),
        });

        expect(injectedClient).toBe(moduleClient);
    });
});
