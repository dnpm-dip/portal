import { flushPromises } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';
import type { RDHTTPClient } from '../../../src/runtime/core';
import { injectHTTPClient } from '../../../src/runtime/core';
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
let injectedClient: RDHTTPClient | undefined;

const Probe = defineComponent({
    setup() {
        injectedClient = injectHTTPClient();
        injectedClient.query.getOne('q-1');

        return () => h('div');
    },
});

describe('mountModuleComponent', () => {
    beforeEach(() => {
        injectedClient = undefined;
    });

    it('routes a component-injected request through the fake client', async () => {
        const { client } = mountModuleComponent(Probe, {}, {
            'GET /rd/queries/:id': () => ({
                id: 'q-1',
                submittedAt: '2026-01-01T00:00:00Z',
                querier: 'querier-1',
                mode: { code: 'local' },
                criteria: { diagnoses: [] },
                expiresAfter: 3600,
                lastUpdate: '2026-01-01T00:00:00Z',
                peers: [],
            }),
        });

        await flushPromises();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
    });

    it('provides the same module client instance the harness returns', () => {
        const { moduleClient } = mountModuleComponent(Probe, {}, {
            'GET /rd/queries/:id': () => ({
                id: 'q-1',
                submittedAt: '2026-01-01T00:00:00Z',
                querier: 'querier-1',
                mode: { code: 'local' },
                criteria: { diagnoses: [] },
                expiresAfter: 3600,
                lastUpdate: '2026-01-01T00:00:00Z',
                peers: [],
            }),
        });

        expect(injectedClient).toBe(moduleClient);
    });
});
