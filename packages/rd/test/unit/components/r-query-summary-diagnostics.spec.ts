import { flushPromises } from '@vue/test-utils';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import type { App } from 'vue';
import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import type { FakeHandler } from '@dnpm-dip/http-kit/testing';
import { QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore } from '@dnpm-dip/vue';
import RQuerySummaryDiagnostics from '../../../src/runtime/components/core/RQuerySummaryDiagnostics.vue';
import { QueryURLFilterKey } from '../../../src/runtime/constants';
import type { QuerySummaryDiagnostics } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

/**
 * DKVChart renders a live chart.js instance, which needs a laid-out canvas in
 * a real document: @vue/test-utils mounts detached, so chart.js' resize path
 * rejects outside the test's own promise chain (an unhandled rejection, not a
 * failing assertion). The stub keeps the distributions this component hands
 * down observable as plain props.
 */
vi.mock('@dnpm-dip/vue', async (importOriginal) => {
    const actual = await importOriginal<Record<string, unknown>>();
    const { defineComponent, h } = await import('vue');

    return {
        ...actual,
        DKVChart: defineComponent({
            name: 'DKVChart',
            props: { items: { type: Array, default: () => [] } },
            setup: (props) => () => h('div', { class: 'kv-chart-stub' }, `${props.items.length}`),
        }),
    };
});

const summary : QuerySummaryDiagnostics = {
    overallDistributions: {
        hpoTerms: {
            total: 2,
            elements: [{ key: { code: 'HP:0001250', display: 'Seizure' }, value: { count: 2, percent: 100 } }],
        },
        diagnoses: {
            total: 2,
            elements: [{ key: { code: 'ORPHA:98896', display: 'Ataxie' }, value: { count: 2, percent: 100 } }],
        },
    },
    distributionsByVariant: [
        {
            key: { code: 'BRCA1', display: 'BRCA1' },
            value: {
                diagnoses: {
                    total: 1,
                    elements: [{ key: { code: 'ORPHA:773', display: 'Neurofibromatose' }, value: { count: 1, percent: 100 } }],
                },
                hpoTerms: {
                    total: 1,
                    elements: [{ key: { code: 'HP:0001252', display: 'Hypotonia' }, value: { count: 1, percent: 100 } }],
                },
            },
        },
    ],
};

async function mountSummary(handler: FakeHandler = () => summary) {
    const mounted = mountModuleComponent(RQuerySummaryDiagnostics, { queryId: 'q-1' }, { 'GET /rd/queries/:id/diagnostics': handler });

    await flushPromises();

    const app = mounted.wrapper.vm.$.appContext.app as App;

    return {
        ...mounted,
        store: useQueryFilterStore(mounted.pinia, app),
        eventBus: injectQueryEventBus(app),
    };
}

describe('RQuerySummaryDiagnostics', () => {
    it('should load the diagnostics of the query on mount', async () => {
        const { client } = await mountSummary();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/diagnostics');
    });

    it('should omit the query string while no filter is set', async () => {
        const { client } = await mountSummary();

        expect(client.requests[0]?.url).not.toContain('?');
    });

    it('should carry the query filter store record into the request', async () => {
        const {
            client,
            store,
            eventBus,
        } = await mountSummary();

        store.setItems(QueryURLFilterKey.HPO_VALUE, [{ code: 'HP:0001250' }]);
        eventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
        await flushPromises();

        expect(client.requests).toHaveLength(2);
        expect(decodeURIComponent(client.requests[1]?.url ?? '')).toContain('hpo[value]=HP:0001250');
    });

    it('should reload when the query session is updated', async () => {
        const { client, eventBus } = await mountSummary();

        eventBus.emit(QueryEventBusEventName.SESSION_UPDATED, {
            id: 'q-1',
            submittedAt: '2026-01-01T00:00:00Z',
            querier: 'querier-1',
            mode: { code: 'local' },
            expiresAfter: 3600,
            lastUpdate: '2026-01-01T00:00:00Z',
            peers: [],
        }, null);
        await flushPromises();

        expect(client.requests).toHaveLength(2);
    });

    it('should stop reloading once unmounted', async () => {
        const {
            wrapper, 
            client, 
            eventBus, 
        } = await mountSummary();

        wrapper.unmount();

        eventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
        await flushPromises();

        expect(client.requests).toHaveLength(1);
    });

    it('should render both overall distribution sections once loaded', async () => {
        const { wrapper } = await mountSummary();

        expect(wrapper.text()).toContain('Diagnose Kategorien');
        expect(wrapper.text()).toContain('HPOTermen');
        // Both headings are printed by the placeholder branch too, so the
        // loaded branch is only provable by the charts replacing them.
        expect(wrapper.findComponent({ name: 'VCPlaceholder' }).exists()).toBe(false);
        expect(wrapper.findAllComponents({ name: 'DKVChart' })).toHaveLength(2);
    });

    it('should render placeholders while the request is pending', async () => {
        const { wrapper } = await mountSummary(() => new Promise(() => {}));

        expect(wrapper.findComponent({ name: 'VCPlaceholder' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'DKVChart' }).exists()).toBe(false);
    });

    it('should chart the diagnosis and hpo elements of the overall distributions', async () => {
        const { wrapper } = await mountSummary();

        const charts = wrapper.findAllComponents({ name: 'DKVChart' });

        expect(charts[0]?.props('items')).toEqual(summary.overallDistributions.diagnoses.elements);
        expect(charts[1]?.props('items')).toEqual(summary.overallDistributions.hpoTerms.elements);
    });

    it('should offer every per-variant distribution by its variant key', async () => {
        const { wrapper } = await mountSummary();

        expect(wrapper.text()).toContain('Verteilung nach Varianten');
        expect(wrapper.findComponent({ name: 'DQuerySummaryGrouped' }).props('label')).toBe('Variante');
        expect(wrapper.text()).toContain('BRCA1');
    });

    it('should chart the distributions of the selected variant', async () => {
        const { wrapper } = await mountSummary();

        const grouped = wrapper.findComponent({ name: 'DQuerySummaryGrouped' });
        (grouped.vm as unknown as { id: number }).id = 0;
        await flushPromises();

        const charts = wrapper.findAllComponents({ name: 'DKVChart' });

        expect(charts).toHaveLength(4);
        expect(charts[2]?.props('items')).toEqual(summary.distributionsByVariant[0]?.value.diagnoses.elements);
        expect(charts[3]?.props('items')).toEqual(summary.distributionsByVariant[0]?.value.hpoTerms.elements);
    });

    it('should render an error alert when the request fails', async () => {
        const { wrapper } = await mountSummary(() => fakeResponse(500, { issues: [{ severity: 'error', details: 'boom' }] }));

        expect(wrapper.text()).toContain('Daten konnten nicht geladen werden.');
    });
});
