import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Suspense, defineComponent, h } from 'vue';
import type { App } from 'vue';
import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import type { FakeHandler } from '@dnpm-dip/http-kit/testing';
import { useQueryFilterStore } from '@dnpm-dip/vue';
import type { QueryFilterStore } from '@dnpm-dip/vue';
import RQueryDiagnosisFilter from '../../../src/runtime/components/core/RQueryDiagnosisFilter.vue';
import { QueryURLFilterKey } from '../../../src/runtime/constants';
import type { QueryDiagnosisFilter } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

const filter : QueryDiagnosisFilter = {
    category: [
        { code: 'ORPHA:98896', display: 'Ataxie' },
        { code: 'ORPHA:773', display: 'Neurofibromatose' },
        { code: 'ORPHA:586', display: 'Mukoviszidose' },
    ],
};

/**
 * RQueryDiagnosisFilter declares `async setup()`, so Vue only renders it
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
        return () => h(Suspense, null, { default: () => h(RQueryDiagnosisFilter, { queryId: props.queryId }) });
    },
});

async function mountFilter(
    handler: FakeHandler = () => filter,
    seed?: (store: QueryFilterStore) => void,
) {
    const mounted = mountModuleComponent(SuspenseHost, { queryId: 'q-1' }, { 'GET /rd/queries/:id/filters/diagnosis': handler });
    const store = useQueryFilterStore(mounted.pinia, mounted.wrapper.vm.$.appContext.app as App);

    seed?.(store);

    await flushPromises();

    return {
        ...mounted,
        instance: mounted.wrapper.findComponent(RQueryDiagnosisFilter),
        store,
    };
}

describe('RQueryDiagnosisFilter', () => {
    it('should read the diagnosis filter of the given query', async () => {
        const { client } = await mountFilter();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/filters/diagnosis');
    });

    it('should render the filter box title', async () => {
        const { wrapper } = await mountFilter();

        expect(wrapper.text()).toContain('Diagnose');
        expect(wrapper.text()).toContain('Kategorie');
    });

    it('should render one checkbox per available category', async () => {
        const { wrapper } = await mountFilter();

        expect(wrapper.findAll('.form-check')).toHaveLength(3);
    });

    it('should preselect every available category and stay inactive', async () => {
        const { instance, store } = await mountFilter();

        expect(instance.vm.category).toEqual(['ORPHA:98896', 'ORPHA:773', 'ORPHA:586']);
        expect(store.getItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY)).toEqual([]);
        expect(instance.vm.active).toBe(false);
    });

    it('should adopt a preexisting store selection instead of preselecting everything', async () => {
        const { instance } = await mountFilter(
            () => filter,
            (store) => store.setItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY, [{ code: 'ORPHA:773' }]),
        );

        expect(instance.vm.category).toEqual(['ORPHA:773']);
        expect(instance.vm.active).toBe(true);
    });

    it('should ignore store items that are not offered by the server', async () => {
        const { instance } = await mountFilter(
            () => filter,
            (store) => store.setItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY, [{ code: 'ORPHA:0000' }]),
        );

        expect(instance.vm.category).toEqual(['ORPHA:98896', 'ORPHA:773', 'ORPHA:586']);
    });

    it('should commit the selected subset with its full coding to the query filter store', async () => {
        const {
            wrapper,
            instance,
            store,
        } = await mountFilter();

        await wrapper.findComponent({ name: 'VCFormCheckboxGroup' })
            .vm.$emit('update:modelValue', ['ORPHA:98896', 'ORPHA:773']);
        await flushPromises();

        expect(store.getItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY)).toEqual([
            { code: 'ORPHA:98896', display: 'Ataxie' },
            { code: 'ORPHA:773', display: 'Neurofibromatose' },
        ]);
        expect(instance.vm.active).toBe(true);
    });

    it('should clear the filter again once every category is selected', async () => {
        const {
            wrapper,
            instance,
            store,
        } = await mountFilter();

        const group = wrapper.findComponent({ name: 'VCFormCheckboxGroup' });

        await group.vm.$emit('update:modelValue', ['ORPHA:98896']);
        await flushPromises();
        await group.vm.$emit('update:modelValue', ['ORPHA:98896', 'ORPHA:773', 'ORPHA:586']);
        await flushPromises();

        expect(store.getItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY)).toEqual([]);
        expect(instance.vm.active).toBe(false);
    });

    it('should reselect everything on reset', async () => {
        const {
            wrapper,
            instance,
            store,
        } = await mountFilter();

        await wrapper.findComponent({ name: 'VCFormCheckboxGroup' })
            .vm.$emit('update:modelValue', ['ORPHA:98896']);
        await flushPromises();

        await wrapper.findComponent({ name: 'DQueryFilterBox' }).vm.$emit('reset');
        await flushPromises();

        expect(instance.vm.category).toEqual(['ORPHA:98896', 'ORPHA:773', 'ORPHA:586']);
        expect(store.getItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY)).toEqual([]);
    });

    it('should offer no categories when the filter request fails', async () => {
        const { wrapper, instance } = await mountFilter(() => fakeResponse(500, { issues: [] }));

        expect(instance.vm.available).toEqual({});
        expect(instance.vm.availableInitialized).toBe(true);
        expect(wrapper.findComponent({ name: 'VCFormCheckboxGroup' }).exists()).toBe(false);
    });
});
