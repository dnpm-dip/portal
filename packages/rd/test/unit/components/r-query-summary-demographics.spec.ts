import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { App } from 'vue';
import type { QuerySummaryDemographics } from '@dnpm-dip/http-kit';
import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import type { FakeHandler } from '@dnpm-dip/http-kit/testing';
import { QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore } from '@dnpm-dip/vue';
import RQuerySummaryDemographics from '../../../src/runtime/components/core/RQuerySummaryDemographics.vue';
import { QueryURLFilterKey } from '../../../src/runtime/constants';
import { mountModuleComponent } from '../../utils';

const summary : QuerySummaryDemographics = {
    siteDistribution: {
        total: 2,
        elements: [{ key: { code: 'site-a', display: 'Standort A' }, value: { count: 2, percent: 100 } }],
    },
    genderDistribution: {
        total: 2,
        elements: [{ key: { code: 'male', display: 'Männlich' }, value: { count: 2, percent: 100 } }],
    },
    ageDistribution: {
        total: 2,
        elements: [{ key: { min: 40, max: 49 }, value: { count: 2, percent: 100 } }],
    },
};

async function mountSummary(handler: FakeHandler = () => summary) {
    const mounted = mountModuleComponent(RQuerySummaryDemographics, { queryId: 'q-1' }, { 'GET /rd/queries/:id/demographics': handler });

    await flushPromises();

    const app = mounted.wrapper.vm.$.appContext.app as App;

    return {
        ...mounted,
        store: useQueryFilterStore(mounted.pinia, app),
        eventBus: injectQueryEventBus(app),
    };
}

describe('RQuerySummaryDemographics', () => {
    it('should load the demographics of the query on mount', async () => {
        const { client } = await mountSummary();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/demographics');
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

        store.setItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY, [{ code: 'ORPHA:98896' }]);
        eventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
        await flushPromises();

        expect(client.requests).toHaveLength(2);
        expect(decodeURIComponent(client.requests[1]?.url ?? '')).toContain('diagnosis[category]=ORPHA:98896');
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

    it('should hand the loaded demographics to the shared renderer', async () => {
        const { wrapper } = await mountSummary();

        // The placeholder branch prints the very same section headings, so the
        // loaded branch is only provable by the renderer it swaps in.
        expect(wrapper.findComponent({ name: 'DQuerySummaryDemographics' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'VCPlaceholder' }).exists()).toBe(false);
    });

    it('should render placeholders while the request is pending', async () => {
        const { wrapper } = await mountSummary(() => new Promise(() => {}));

        expect(wrapper.findComponent({ name: 'VCPlaceholder' }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: 'DQuerySummaryDemographics' }).exists()).toBe(false);
    });

    it('should render an error alert when the request fails', async () => {
        const { wrapper } = await mountSummary(() => fakeResponse(500, { issues: [{ severity: 'error', details: 'boom' }] }));

        expect(wrapper.text()).toContain('Daten konnten nicht geladen werden.');
    });
});
