import installTable from '@vuecs/table';
import { VCFormSelectSearch } from '@vuecs/forms';
import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import {
    DKVChartTableSwitch,
    DQuerySummaryGrouped,
    QueryEventBusEventName,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/vue';
import { mountComponent } from '@dnpm-dip/vue/testing';
import MQuerySummaryMedication from '../../../src/runtime/components/core/query-summary/MQuerySummaryMedication.vue';
import { MTBAPIClient, provideHTTPClient } from '../../../src/runtime/core/http-client';
import { QueryFilterURLKey } from '../../../src/runtime/constants';
import type { QuerySummaryMedication } from '../../../src/runtime/domains';

const everolimus = [{ code: 'L01EG02', display: 'Everolimus' }];
const gene = { code: 'PTEN', display: 'PTEN' };

const summary : QuerySummaryMedication = {
    recommendations: {
        overallDistribution: { total: 2, elements: [] },
        distributionBySupportingVariant: [{
            key: { gene },
            value: {
                total: 2,
                elements: [{ key: everolimus, value: { count: 2, percent: 100 } }],
            },
            children: [{
                key: {
                    gene, 
                    type: 'SNV', 
                    proteinChange: 'R130Q', 
                },
                value: {
                    total: 1,
                    elements: [{ key: everolimus, value: { count: 1, percent: 100 } }],
                },
            }, {
                key: {
                    gene, 
                    type: 'CNV', 
                    copyNumberType: 'Deletion', 
                },
                value: {
                    total: 1,
                    elements: [{ key: everolimus, value: { count: 1, percent: 100 } }],
                },
            }],
        }, {
            key: { gene: { code: 'BRAF' } },
            value: { total: 3, elements: [] },
        }],
    },
    therapies: {
        meanDurations: [],
        overallDistribution: { total: 0, elements: [] },
    },
};

async function mountSummary(entity = summary) {
    let store : ReturnType<typeof useQueryFilterStore>;
    let eventBus : ReturnType<typeof injectQueryEventBus>;
    const mounted = mountComponent(MQuerySummaryMedication, { queryId: 'q-1' }, { 'GET /mtb/queries/:id/medication': () => entity }, {
        onApp: (app, client) => {
            app.use(installTable);
            provideHTTPClient(new MTBAPIClient(client), app);
            store = app.runWithContext(() => useQueryFilterStore());
            eventBus = injectQueryEventBus(app);
        },
    });
    await flushPromises();
    return {
        ...mounted, 
        store: store!, 
        eventBus: eventBus!, 
    };
}

describe('MQuerySummaryMedication', () => {
    it('should navigate from gene totals to individual alterations and back without changing filters', async () => {
        const {
            wrapper, 
            client, 
            store, 
        } = await mountSummary();
        const card = () => wrapper.findAll('.entity-card')[0]!;
        const distribution = () => card().findComponent(DKVChartTableSwitch);
        const selectAlteration = async (index: number) => {
            card().findAllComponents(DQuerySummaryGrouped)[1]!
                .findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', index);
            await flushPromises();
        };

        expect(card().text()).toContain('N = 2');
        expect(distribution().props('data')).toEqual(summary.recommendations.distributionBySupportingVariant[0]!.value.elements);

        const alterations = card().findAllComponents(DQuerySummaryGrouped)[1]!;
        expect(alterations.findComponent(VCFormSelectSearch).props('options')).toEqual([
            { value: 0, label: 'Alle Alterationen' },
            { value: 1, label: 'PTEN R130Q' },
            { value: 2, label: 'PTEN Deletion' },
        ]);

        await selectAlteration(1);
        expect(card().text()).toContain('N = 1');
        expect(distribution().props('data')).toEqual(summary.recommendations.distributionBySupportingVariant[0]!.children![0]!.value.elements);
        expect(card().text()).toContain('Everolimus');

        await selectAlteration(2);
        expect(card().text()).toContain('N = 1');
        expect(distribution().props('data')).toEqual(summary.recommendations.distributionBySupportingVariant[0]!.children![1]!.value.elements);

        await selectAlteration(0);
        expect(card().text()).toContain('N = 2');
        expect(client.requests).toHaveLength(1);
        expect(store.buildURLRecord()).not.toHaveProperty(QueryFilterURLKey.THERAPY_RECOMMENDED);
        wrapper.unmount();
    });

    it('should reset alteration selection when switching genes and support genes without children', async () => {
        const { wrapper } = await mountSummary();
        const selectors = () => wrapper.findAllComponents(DQuerySummaryGrouped);
        selectors()[1]!.findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 2);
        await flushPromises();

        selectors()[0]!.findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 1);
        await flushPromises();
        expect(wrapper.findAll('.entity-card')[0]!.text()).toContain('N = 3');
        expect(selectors()[1]!.findComponent(VCFormSelectSearch).props('options')).toEqual([
            { value: 0, label: 'Alle Alterationen' },
        ]);

        selectors()[0]!.findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 0);
        await flushPromises();
        expect(wrapper.findAll('.entity-card')[0]!.text()).toContain('N = 2');
        wrapper.unmount();
    });

    it('should refresh the selected alteration distribution when the query results change', async () => {
        const entity = structuredClone(summary);
        const { wrapper, eventBus } = await mountSummary(entity);
        wrapper.findAllComponents(DQuerySummaryGrouped)[1]!
            .findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 1);
        await flushPromises();

        const distribution = entity.recommendations.distributionBySupportingVariant[0]!.children![0]!.value;
        distribution.total = 4;
        distribution.elements[0]!.value = { count: 4, percent: 100 };
        eventBus.emit(QueryEventBusEventName.SESSION_UPDATED);
        await flushPromises();

        expect(wrapper.findAll('.entity-card')[0]!.text()).toContain('N = 4');
        expect(wrapper.findComponent(DKVChartTableSwitch).props('data')).toEqual(distribution.elements);
        wrapper.unmount();
    });

    it('should still apply the medication filter from an alteration distribution', async () => {
        const { wrapper, store } = await mountSummary();
        wrapper.findAllComponents(DQuerySummaryGrouped)[1]!
            .findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 1);
        await flushPromises();

        wrapper.findComponent(DKVChartTableSwitch).vm.$emit('clicked', everolimus);
        await flushPromises();
        expect(store.buildURLRecord()).toEqual({ [QueryFilterURLKey.THERAPY_RECOMMENDED]: 'L01EG02' });

        wrapper.findComponent(DKVChartTableSwitch).vm.$emit('clicked', everolimus);
        await flushPromises();
        expect(store.buildURLRecord()).not.toHaveProperty(QueryFilterURLKey.THERAPY_RECOMMENDED);
        expect(wrapper.findAll('.entity-card')[0]!.text()).toContain('N = 2');
        wrapper.unmount();
    });
});
