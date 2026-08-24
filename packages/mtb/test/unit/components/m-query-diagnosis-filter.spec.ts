import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Suspense, defineComponent, h } from 'vue';
import type { App } from 'vue';
import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import { useQueryFilterStore } from '@dnpm-dip/vue';
import type { QueryFilterStore } from '@dnpm-dip/vue';
import type { FakeHandler } from '@dnpm-dip/http-kit/testing';
import MQueryDiagnosisFilter from '../../../src/runtime/components/core/query-filter/MQueryDiagnosisFilter.vue';
import { QueryFilterURLKey } from '../../../src/runtime/constants';
import type { QueryDiagnosisFilter } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

const filter : QueryDiagnosisFilter = {
    code: [
        { code: 'C50', display: 'Mamma' },
        { code: 'C25', display: 'Pankreas' },
        { code: 'C34', display: 'Lunge' },
    ],
};

/**
 * MQueryDiagnosisFilter declares `async setup()`, so Vue only renders it
 * inside a Suspense boundary — Nuxt provides one per page, @vue/test-utils
 * does not.
 */
const SuspenseHost = defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        return () => h(Suspense, null, { default: () => h(MQueryDiagnosisFilter, { queryId: props.queryId }) });
    },
});

async function mountFilter(
    handler: FakeHandler = () => filter,
    seed?: (store: QueryFilterStore) => void,
) {
    const mounted = mountModuleComponent(SuspenseHost, { queryId: 'q-1' }, { 'GET /mtb/queries/:id/filters/diagnosis': handler });
    const store = useQueryFilterStore(mounted.pinia, mounted.wrapper.vm.$.appContext.app as App);

    seed?.(store);

    await flushPromises();

    return {
        ...mounted,
        instance: mounted.wrapper.findComponent(MQueryDiagnosisFilter),
        store,
    };
}

describe('MQueryDiagnosisFilter', () => {
    it('should read the diagnosis filter of the given query', async () => {
        const { client } = await mountFilter();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/filters/diagnosis');
    });

    it('should render the filter box title', async () => {
        const { wrapper } = await mountFilter();

        expect(wrapper.text()).toContain('Diagnose');
    });

    it('should offer the available codings sorted by code', async () => {
        const { instance } = await mountFilter();

        expect(instance.vm.availableSubset.map((el: any) => el.code)).toEqual(['C25', 'C34', 'C50']);
    });

    it('should offer only the first page of available codings', async () => {
        const codings = Array.from({ length: 12 }, (_, index) => ({ code: `C${10 + index}` }));
        const { instance } = await mountFilter(() => ({ code: codings } satisfies QueryDiagnosisFilter));

        expect(instance.vm.total).toBe(12);
        expect(instance.vm.availableSubset).toHaveLength(10);
        expect(instance.vm.availableSubset[0]?.code).toBe('C10');
    });

    it('should preselect every available coding and stay inactive', async () => {
        const { instance, store } = await mountFilter();

        expect(instance.vm.items).toEqual(['C25', 'C34', 'C50']);
        expect(store.getItems(QueryFilterURLKey.DIAGNOSIS_CODE)).toEqual([]);
        expect(instance.vm.active).toBe(false);
    });

    it('should adopt a preexisting store selection instead of preselecting everything', async () => {
        const { instance } = await mountFilter(
            () => filter,
            (store) => store.setItems(QueryFilterURLKey.DIAGNOSIS_CODE, [{ code: 'C34' }]),
        );

        expect(instance.vm.items).toEqual(['C34']);
        expect(instance.vm.active).toBe(true);
    });

    it('should ignore store items that are not offered by the server', async () => {
        const { instance } = await mountFilter(
            () => filter,
            (store) => store.setItems(QueryFilterURLKey.DIAGNOSIS_CODE, [{ code: 'C99' }]),
        );

        expect(instance.vm.items).toEqual(['C25', 'C34', 'C50']);
    });

    it('should commit the selected subset to the query filter store', async () => {
        const {
            wrapper, 
            instance, 
            store, 
        } = await mountFilter();

        await wrapper.findComponent({ name: 'VCFormCheckboxGroup' })
            .vm.$emit('update:modelValue', ['C25', 'C34']);
        await flushPromises();

        expect(store.getItems(QueryFilterURLKey.DIAGNOSIS_CODE)).toEqual([
            { code: 'C25' },
            { code: 'C34' },
        ]);
        expect(instance.vm.active).toBe(true);
    });

    it('should clear the filter again once every coding is selected', async () => {
        const {
            wrapper, 
            instance, 
            store, 
        } = await mountFilter();

        const group = wrapper.findComponent({ name: 'VCFormCheckboxGroup' });

        await group.vm.$emit('update:modelValue', ['C25']);
        await flushPromises();
        await group.vm.$emit('update:modelValue', ['C25', 'C34', 'C50']);
        await flushPromises();

        expect(store.getItems(QueryFilterURLKey.DIAGNOSIS_CODE)).toEqual([]);
        expect(instance.vm.active).toBe(false);
    });

    it('should reselect everything on reset', async () => {
        const {
            wrapper, 
            instance, 
            store, 
        } = await mountFilter();

        await wrapper.findComponent({ name: 'VCFormCheckboxGroup' })
            .vm.$emit('update:modelValue', ['C25']);
        await flushPromises();

        await wrapper.findComponent({ name: 'DQueryFilterBox' }).vm.$emit('reset');
        await flushPromises();

        expect(instance.vm.items).toEqual(['C25', 'C34', 'C50']);
        expect(store.getItems(QueryFilterURLKey.DIAGNOSIS_CODE)).toEqual([]);
    });

    it('should offer no codings when the filter request fails', async () => {
        const {
            wrapper,
            instance,
            store,
        } = await mountFilter(() => fakeResponse(500, { issues: [] }));

        expect(instance.vm.availableSubset).toEqual([]);
        expect(instance.vm.total).toBe(0);
        expect(instance.vm.active).toBe(false);
        expect(store.getItems(QueryFilterURLKey.DIAGNOSIS_CODE)).toEqual([]);
        expect(wrapper.findComponent({ name: 'DQueryFilterBox' }).exists()).toBe(true);
    });
});
