import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { App } from 'vue';
import type { ResourceCollectionResponse } from '@dnpm-dip/http-kit';
import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import { QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore } from '@dnpm-dip/vue';
import type { FakeHandler } from '@dnpm-dip/http-kit/testing';
import MQuerySummaryCoarseTherapyResponses from '../../../src/runtime/components/core/query-summary/MQuerySummaryCoarseTherapyResponses.vue';
import { QueryFilterURLKey } from '../../../src/runtime/constants';
import type { QueryCoarseTherapyResponse, QuerySession } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

const session : QuerySession = {
    id: 'q-1',
    submittedAt: '2026-01-01T00:00:00Z',
    querier: 'querier-1',
    mode: { code: 'local' },
    criteria: {},
    expiresAfter: 3600,
    lastUpdate: '2026-01-01T00:00:00Z',
    peers: [],
};

const collection : ResourceCollectionResponse<QueryCoarseTherapyResponse> = {
    entries: [
        {
            tumorEntity: { code: 'C25', display: 'Pankreas' },
            medications: [{ code: 'L01EC02', display: 'Dabrafenib' }],
            supportingAlterations: [{
                gene: { code: 'BRAF' }, 
                type: 'SNV', 
                proteinChange: 'V600E', 
            }],
            levelsOfEvidence: [{ code: 'm1A' }],
            count: 4,
            countResponderPFSRatio: 0.5,
            orr: 50,
            dcr: 75,
            meanDuration: 12.34,
            responseDistribution: {
                total: 4,
                elements: [{ key: { code: 'PR' }, value: { count: 2, percent: 50 } }],
            },
        },
    ],
    size: 1,
};

async function mountSummary(handler: FakeHandler = () => collection) {
    const mounted = mountModuleComponent(MQuerySummaryCoarseTherapyResponses, { queryId: 'q-1' }, { 'GET /mtb/queries/:id/coarse-therapy-responses': handler });

    await flushPromises();

    const app = mounted.wrapper.vm.$.appContext.app as App;

    return {
        ...mounted,
        store: useQueryFilterStore(mounted.pinia, app),
        eventBus: injectQueryEventBus(app),
    };
}

describe('MQuerySummaryCoarseTherapyResponses', () => {
    it('should load the coarse therapy responses of the query on mount', async () => {
        const { client } = await mountSummary();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/coarse-therapy-responses');
        expect(client.requests[0]?.url).toContain('limit=50');
        expect(client.requests[0]?.url).toContain('offset=0');
    });

    it('should reload with the requested page', async () => {
        const { wrapper, client } = await mountSummary();

        wrapper.vm.load({ limit: 10, offset: 20 });
        await flushPromises();

        expect(client.requests[1]?.url).toContain('limit=10');
        expect(client.requests[1]?.url).toContain('offset=20');
    });

    it('should adopt the page window reported by the server', async () => {
        const { wrapper, client } = await mountSummary(() => ({
            ...collection, 
            limit: 25, 
            offset: 75, 
        }));

        await wrapper.findComponent({ name: 'VCTableSortIndicators' })
            .vm.$emit('update:sort', [{ key: 'count', direction: 'asc' }]);
        await flushPromises();

        expect(client.requests[1]?.url).toContain('limit=25');
        expect(client.requests[1]?.url).toContain('offset=75');
    });

    it('should map the tumor entity column onto its display path when sorting', async () => {
        const { wrapper, client } = await mountSummary();

        await wrapper.findComponent({ name: 'VCTableSortIndicators' })
            .vm.$emit('update:sort', [{ key: 'tumorEntity', direction: 'desc' }]);
        await flushPromises();

        expect(client.requests[1]?.url).toContain('sort=-tumorEntity.display');
    });

    it('should pass a plain column key through when sorting', async () => {
        const { wrapper, client } = await mountSummary();

        await wrapper.findComponent({ name: 'VCTableSortIndicators' })
            .vm.$emit('update:sort', [{ key: 'count', direction: 'asc' }]);
        await flushPromises();

        expect(client.requests[1]?.url).toContain('sort=count');
    });

    it('should reload from the first page when the filters are commited', async () => {
        const {
            wrapper, 
            client, 
            eventBus, 
        } = await mountSummary();

        wrapper.vm.load({ limit: 50, offset: 100 });
        await flushPromises();

        expect(client.requests[1]?.url).toContain('offset=100');

        eventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
        await flushPromises();

        expect(client.requests[2]?.url).toContain('offset=0');
    });

    it('should reload from the first page when the query session is updated', async () => {
        const {
            wrapper,
            client,
            eventBus,
        } = await mountSummary();

        wrapper.vm.load({ limit: 50, offset: 100 });
        await flushPromises();

        expect(client.requests[1]?.url).toContain('offset=100');

        eventBus.emit(QueryEventBusEventName.SESSION_UPDATED, session, null);
        await flushPromises();

        expect(client.requests).toHaveLength(3);
        expect(client.requests[2]?.url).toContain('offset=0');
    });

    it('should carry the query filter store record into the request', async () => {
        const {
            client, 
            store, 
            eventBus, 
        } = await mountSummary();

        store.setItems(QueryFilterURLKey.THERAPY_IMPLEMENTED, [
            { id: 'L01EC02', children: [{ code: 'L01EC02' }] },
        ]);
        eventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
        await flushPromises();

        expect(decodeURIComponent(client.requests[1]?.url ?? '')).toContain('therapy[medication]=L01EC02');
    });

    it('should select the medication as therapy filter and reload', async () => {
        const {
            wrapper, 
            client, 
            store, 
        } = await mountSummary();

        wrapper.vm.handleMedicationClick({ code: 'L01EC02', display: 'Dabrafenib' });
        await flushPromises();

        expect(store.getItems(QueryFilterURLKey.THERAPY_IMPLEMENTED)).toEqual([
            { id: 'L01EC02', children: [{ code: 'L01EC02', display: 'Dabrafenib' }] },
        ]);
        expect(decodeURIComponent(client.requests[1]?.url ?? '')).toContain('therapy[medication]=L01EC02');
    });

    it('should deselect an already selected medication', async () => {
        const { wrapper, store } = await mountSummary();

        wrapper.vm.handleMedicationClick({ code: 'L01EC02', display: 'Dabrafenib' });
        await flushPromises();
        wrapper.vm.handleMedicationClick({ code: 'L01EC02', display: 'Dabrafenib' });
        await flushPromises();

        expect(store.getItems(QueryFilterURLKey.THERAPY_IMPLEMENTED)).toEqual([]);
    });

    it('should render an error alert when the request fails', async () => {
        const { wrapper } = await mountSummary(() => fakeResponse(500, { issues: [{ severity: 'error', details: 'boom' }] }));

        expect(wrapper.text()).toContain('Daten konnten nicht geladen werden.');
    });

    it('should format the optional rate and duration columns', async () => {
        const { wrapper } = await mountSummary();

        expect(wrapper.vm.formatNumber(12.34)).toBe('12.3');
        expect(wrapper.vm.formatNumber(50, 0)).toBe('50');
        expect(wrapper.vm.formatNumber(undefined)).toBe('—');
    });
});
