import { VCAlert } from '@vuecs/elements';
import { flushPromises } from '@vue/test-utils';
import type { PropType } from 'vue';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import type { ResourceCollectionLoadMeta } from '@dnpm-dip/http-kit';
import { defineResourceCollectionEvents } from '@dnpm-dip/http-kit';
import type {
    ResourceCollectionDefaultSlotProps,
    ResourceCollectionManagerLoadFn,
} from '../../../../src';
import { createResourceCollectionManager } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

type Entry = {
    id: string,
    name: string
};

const Host = defineComponent({
    props: {
        load: {
            type: Function as PropType<ResourceCollectionManagerLoadFn<Entry>>,
            required: true,
        },
    },
    emits: defineResourceCollectionEvents<Entry>(),
    setup(props, setup) {
        const manager = createResourceCollectionManager<Entry>({
            load: (meta) => props.load(meta),
            slots: setup.slots,
            emit: setup.emit,
            expose: setup.expose,
        });

        return () => manager.render();
    },
});

function mountCollection(
    load: ResourceCollectionManagerLoadFn<Entry>,
    slots: Record<string, any>,
) {
    const Wrapper = () => h(Host, { load }, slots);

    const mounted = mountComponent(Wrapper, {}, {});

    return { ...mounted, host: mounted.wrapper.findComponent(Host) };
}

function defaultSlot(capture?: (props: ResourceCollectionDefaultSlotProps<Entry>) => void) {
    return (props: ResourceCollectionDefaultSlotProps<Entry>) => {
        capture?.(props);

        return h('span', props.data.map((item) => item.name).join(','));
    };
}

describe('createResourceCollectionManager', () => {
    it('should load on mount and hand the entries to the default slot', async () => {
        let slotProps : ResourceCollectionDefaultSlotProps<Entry> | undefined;

        const { wrapper } = mountCollection(
            async () => ({ data: [{ id: '1', name: 'A' }, { id: '2', name: 'B' }], total: 2 }),
            { default: defaultSlot((props) => { slotProps = props; }) },
        );

        await flushPromises();

        expect(wrapper.text()).toBe('A,B');
        expect(slotProps?.total).toBe(2);
    });

    it('should load with the default limit and offset', async () => {
        const calls : ResourceCollectionLoadMeta[] = [];

        mountCollection(
            async (meta) => {
                calls.push(meta);

                return { data: [], total: 0 };
            },
            { default: defaultSlot() },
        );

        await flushPromises();

        expect(calls).toHaveLength(1);
        expect(calls[0]).toEqual({ limit: 20, offset: 0 });
    });

    it('should reset the offset when the slot reloads with changed filters', async () => {
        const calls : ResourceCollectionLoadMeta[] = [];
        let slotProps : ResourceCollectionDefaultSlotProps<Entry> | undefined;

        mountCollection(
            async (meta) => {
                calls.push({ ...meta });

                return { data: [], total: 0 };
            },
            { default: defaultSlot((props) => { slotProps = props; }) },
        );

        await flushPromises();

        await slotProps?.load({ offset: 40, filters: { name: 'A' } });
        await slotProps?.load({ offset: 40, filters: { name: 'B' } });

        expect(calls[1]).toEqual({
            limit: 20, 
            offset: 40, 
            filters: { name: 'A' }, 
        });
        expect(calls[2]).toEqual({
            limit: 20, 
            offset: 0, 
            filters: { name: 'B' }, 
        });
    });

    it('should render the loading slot while the request is in flight', async () => {
        const deferred = Promise.withResolvers<{ data: Entry[], total: number }>();

        const { wrapper } = mountCollection(
            () => deferred.promise,
            {
                loading: () => h('span', 'lädt'),
                default: defaultSlot(),
            },
        );

        await flushPromises();

        expect(wrapper.text()).toContain('lädt');

        deferred.resolve({ data: [{ id: '1', name: 'A' }], total: 1 });
        await flushPromises();

        expect(wrapper.text()).toBe('A');
    });

    it('should render the error and emit failed when the load rejects', async () => {
        const error = new Error('Laden fehlgeschlagen');

        const { wrapper, host } = mountCollection(
            async () => { throw error; },
            { default: defaultSlot() },
        );

        await flushPromises();

        expect(wrapper.findAllComponents(VCAlert)).toHaveLength(1);
        expect(wrapper.text()).toContain('Laden fehlgeschlagen');
        expect(host.emitted('failed')?.[0]).toEqual([error]);
    });

    it('should append a created entity and emit created', async () => {
        let slotProps : ResourceCollectionDefaultSlotProps<Entry> | undefined;

        const { wrapper, host } = mountCollection(
            async () => ({ data: [{ id: '1', name: 'A' }], total: 1 }),
            { default: defaultSlot((props) => { slotProps = props; }) },
        );

        await flushPromises();

        slotProps?.created({ id: '2', name: 'B' });
        await nextTick();

        expect(wrapper.text()).toBe('A,B');
        expect(slotProps?.total).toBe(2);
        expect(host.emitted('created')?.[0]).toEqual([{ id: '2', name: 'B' }]);
    });

    it('should drop a deleted entity and emit deleted', async () => {
        let slotProps : ResourceCollectionDefaultSlotProps<Entry> | undefined;

        const { wrapper, host } = mountCollection(
            async () => ({ data: [{ id: '1', name: 'A' }, { id: '2', name: 'B' }], total: 2 }),
            { default: defaultSlot((props) => { slotProps = props; }) },
        );

        await flushPromises();

        slotProps?.deleted({ id: '1', name: 'A' });
        await nextTick();

        expect(wrapper.text()).toBe('B');
        expect(slotProps?.total).toBe(1);
        expect(host.emitted('deleted')?.[0]).toEqual([{ id: '1', name: 'A' }]);
    });

    it('should ignore an entity that is not part of the collection', async () => {
        let slotProps : ResourceCollectionDefaultSlotProps<Entry> | undefined;

        const { wrapper, host } = mountCollection(
            async () => ({ data: [{ id: '1', name: 'A' }], total: 1 }),
            { default: defaultSlot((props) => { slotProps = props; }) },
        );

        await flushPromises();

        slotProps?.deleted({ id: '99', name: 'Z' });
        slotProps?.updated({ id: '99', name: 'Z' });
        await nextTick();

        expect(wrapper.text()).toBe('A');
        expect(host.emitted('deleted')).toBeUndefined();
        expect(host.emitted('updated')).toBeUndefined();
    });

    it('should replace an updated entity and emit updated', async () => {
        let slotProps : ResourceCollectionDefaultSlotProps<Entry> | undefined;

        const { wrapper, host } = mountCollection(
            async () => ({ data: [{ id: '1', name: 'A' }, { id: '2', name: 'B' }], total: 2 }),
            { default: defaultSlot((props) => { slotProps = props; }) },
        );

        await flushPromises();

        slotProps?.updated({ id: '2', name: 'B2' });
        await nextTick();

        expect(wrapper.text()).toBe('A,B2');
        expect(host.emitted('updated')?.[0]).toEqual([{ id: '2', name: 'B2' }]);
    });
});
