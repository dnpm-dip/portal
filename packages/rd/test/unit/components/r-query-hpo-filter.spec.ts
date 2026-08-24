import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Suspense, defineComponent, h } from 'vue';
import type { App } from 'vue';
import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import type { FakeHandler } from '@dnpm-dip/http-kit/testing';
import { useQueryFilterStore } from '@dnpm-dip/vue';
import type { QueryFilterStore } from '@dnpm-dip/vue';
import RQueryHPOFilter from '../../../src/runtime/components/core/RQueryHPOFilter.vue';
import { QueryURLFilterKey } from '../../../src/runtime/constants';
import type { QueryHpoFilter } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

const filter : QueryHpoFilter = {
    value: [
        { code: 'HP:0001250', display: 'Seizure' },
        { code: 'HP:0001263', display: 'Global developmental delay' },
        { code: 'HP:0001252', display: 'Hypotonia' },
    ],
};

/**
 * RQueryHPOFilter declares `async setup()`, so Vue only renders it inside a
 * Suspense boundary — Nuxt provides one per page, @vue/test-utils does not.
 */
const SuspenseHost = defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        return () => h(Suspense, null, { default: () => h(RQueryHPOFilter, { queryId: props.queryId }) });
    },
});

async function mountFilter(
    handler: FakeHandler = () => filter,
    seed?: (store: QueryFilterStore) => void,
) {
    const mounted = mountModuleComponent(SuspenseHost, { queryId: 'q-1' }, { 'GET /rd/queries/:id/filters/hpo': handler });
    const store = useQueryFilterStore(mounted.pinia, mounted.wrapper.vm.$.appContext.app as App);

    seed?.(store);

    await flushPromises();

    return {
        ...mounted,
        instance: mounted.wrapper.findComponent(RQueryHPOFilter),
        store,
    };
}

describe('RQueryHPOFilter', () => {
    it('should read the hpo filter of the given query', async () => {
        const { client } = await mountFilter();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/filters/hpo');
    });

    it('should render the filter box title', async () => {
        const { wrapper } = await mountFilter();

        expect(wrapper.text()).toContain('HPO');
        expect(wrapper.text()).toContain('Term');
    });

    it('should render one checkbox per available term', async () => {
        const { wrapper } = await mountFilter();

        expect(wrapper.findAll('.form-check')).toHaveLength(3);
    });

    it('should preselect every available term and stay inactive', async () => {
        const { instance, store } = await mountFilter();

        expect(instance.vm.items).toEqual(['HP:0001250', 'HP:0001263', 'HP:0001252']);
        expect(store.getItems(QueryURLFilterKey.HPO_VALUE)).toEqual([]);
        expect(instance.vm.active).toBe(false);
    });

    it('should adopt a preexisting store selection instead of preselecting everything', async () => {
        const { instance } = await mountFilter(
            () => filter,
            (store) => store.setItems(QueryURLFilterKey.HPO_VALUE, [{ code: 'HP:0001252' }]),
        );

        expect(instance.vm.items).toEqual(['HP:0001252']);
        expect(instance.vm.active).toBe(true);
    });

    it('should ignore store items that are not offered by the server', async () => {
        const { instance } = await mountFilter(
            () => filter,
            (store) => store.setItems(QueryURLFilterKey.HPO_VALUE, [{ code: 'HP:0000000' }]),
        );

        expect(instance.vm.items).toEqual(['HP:0001250', 'HP:0001263', 'HP:0001252']);
    });

    it('should commit the selected subset with its full coding to the query filter store', async () => {
        const {
            wrapper,
            instance,
            store,
        } = await mountFilter();

        await wrapper.findComponent({ name: 'VCFormCheckboxGroup' })
            .vm.$emit('update:modelValue', ['HP:0001250', 'HP:0001252']);
        await flushPromises();

        expect(store.getItems(QueryURLFilterKey.HPO_VALUE)).toEqual([
            { code: 'HP:0001250', display: 'Seizure' },
            { code: 'HP:0001252', display: 'Hypotonia' },
        ]);
        expect(instance.vm.active).toBe(true);
    });

    it('should clear the filter again once every term is selected', async () => {
        const {
            wrapper,
            instance,
            store,
        } = await mountFilter();

        const group = wrapper.findComponent({ name: 'VCFormCheckboxGroup' });

        await group.vm.$emit('update:modelValue', ['HP:0001250']);
        await flushPromises();
        await group.vm.$emit('update:modelValue', ['HP:0001250', 'HP:0001263', 'HP:0001252']);
        await flushPromises();

        expect(store.getItems(QueryURLFilterKey.HPO_VALUE)).toEqual([]);
        expect(instance.vm.active).toBe(false);
    });

    it('should reselect everything on reset', async () => {
        const {
            wrapper,
            instance,
            store,
        } = await mountFilter();

        await wrapper.findComponent({ name: 'VCFormCheckboxGroup' })
            .vm.$emit('update:modelValue', ['HP:0001250']);
        await flushPromises();

        await wrapper.findComponent({ name: 'DQueryFilterBox' }).vm.$emit('reset');
        await flushPromises();

        expect(instance.vm.items).toEqual(['HP:0001250', 'HP:0001263', 'HP:0001252']);
        expect(store.getItems(QueryURLFilterKey.HPO_VALUE)).toEqual([]);
    });

    it('should offer no terms when the filter request fails', async () => {
        const { wrapper, instance } = await mountFilter(() => fakeResponse(500, { issues: [] }));

        expect(instance.vm.available).toEqual({});
        expect(instance.vm.availableInitialized).toBe(true);
        expect(wrapper.findComponent({ name: 'VCFormCheckboxGroup' }).exists()).toBe(false);
    });
});
