import { VCAlert } from '@vuecs/elements';
import { flushPromises } from '@vue/test-utils';
import type { PropType, Ref } from 'vue';
import {
    defineComponent,
    h,
    ref,
    toRef,
} from 'vue';
import { describe, expect, it } from 'vitest';
import { defineResourceRecordEvents } from '@dnpm-dip/http-kit';
import type {
    ResourceRecordDefaultSlotProps,
    ResourceRecordManagerLoadFn,
} from '../../../../src';
import { createResourceRecordManager } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

type Entry = {
    id: string,
    name: string
};

const Host = defineComponent({
    props: {
        id: {
            type: String,
            default: undefined,
        },
        load: {
            type: Function as PropType<ResourceRecordManagerLoadFn<Entry>>,
            required: true,
        },
        remove: {
            type: Function as PropType<(id: string) => Promise<Entry>>,
            default: undefined,
        },
        data: {
            type: Object as PropType<Ref<Entry | undefined>>,
            default: undefined,
        },
    },
    emits: defineResourceRecordEvents<Entry>(),
    setup(props, setup) {
        const manager = createResourceRecordManager<Entry>({
            id: toRef(props, 'id'),
            data: props.data,
            load: (id) => props.load(id),
            delete: props.remove,
            slots: setup.slots,
            emit: setup.emit,
        });

        Promise.resolve()
            .then(() => manager.load());

        return () => manager.render();
    },
});

function mountRecord(props: Record<string, any>, slots: Record<string, any>) {
    const Wrapper = () => h(Host, props, slots);

    const mounted = mountComponent(Wrapper, {}, {});

    return { ...mounted, host: mounted.wrapper.findComponent(Host) };
}

function defaultSlot(capture?: (props: ResourceRecordDefaultSlotProps<Entry>) => void) {
    return (props: ResourceRecordDefaultSlotProps<Entry>) => {
        capture?.(props);

        return h('span', props.data.name);
    };
}

describe('createResourceRecordManager', () => {
    it('should load the record for the given id and emit resolved', async () => {
        const ids : string[] = [];

        const { wrapper, host } = mountRecord({
            id: 'record-1',
            load: async (id: string) => {
                ids.push(id);

                return { id, name: 'Bericht' };
            },
        }, { default: defaultSlot() });

        await flushPromises();

        expect(ids).toEqual(['record-1']);
        expect(wrapper.text()).toBe('Bericht');
        expect(host.emitted('resolved')?.[0]).toEqual([{ id: 'record-1', name: 'Bericht' }]);
    });

    it('should not load without an id', async () => {
        let loads = 0;

        const { wrapper } = mountRecord({
            load: async (id: string) => {
                loads += 1;

                return { id, name: 'Bericht' };
            },
        }, { default: defaultSlot() });

        await flushPromises();

        expect(loads).toBe(0);
        expect(wrapper.text()).toBe('');
    });

    it('should take the id from preloaded data instead of requesting it again', async () => {
        let loads = 0;

        const { wrapper, host } = mountRecord({
            data: ref({ id: 'record-2', name: 'Vorgeladen' }),
            load: async (id: string) => {
                loads += 1;

                return { id, name: 'Nachgeladen' };
            },
        }, { default: defaultSlot() });

        await flushPromises();

        expect(loads).toBe(0);
        expect(wrapper.text()).toBe('Vorgeladen');
        expect(host.emitted('resolved')?.[0]).toEqual([{ id: 'record-2', name: 'Vorgeladen' }]);
    });

    it('should refetch preloaded data when the slot reloads with reset', async () => {
        let slotProps : ResourceRecordDefaultSlotProps<Entry> | undefined;

        const { wrapper } = mountRecord({
            data: ref({ id: 'record-2', name: 'Vorgeladen' }),
            load: async (id: string) => ({ id, name: 'Nachgeladen' }),
        }, { default: defaultSlot((props) => { slotProps = props; }) });

        await flushPromises();

        await slotProps?.load(true);

        expect(wrapper.text()).toBe('Nachgeladen');
    });

    it('should render the loading slot while the request is in flight', async () => {
        const deferred = Promise.withResolvers<Entry>();

        const { wrapper } = mountRecord({
            id: 'record-1',
            load: () => deferred.promise,
        }, {
            loading: () => h('span', 'lädt'),
            default: defaultSlot(),
        });

        await flushPromises();

        expect(wrapper.text()).toBe('lädt');

        deferred.resolve({ id: 'record-1', name: 'Bericht' });
        await flushPromises();

        expect(wrapper.text()).toBe('Bericht');
    });

    it('should render the error and emit failed when the load rejects', async () => {
        const error = new Error('Bericht nicht gefunden');

        const { wrapper, host } = mountRecord({
            id: 'record-1',
            load: async () => { throw error; },
        }, { default: defaultSlot() });

        await flushPromises();

        expect(wrapper.findAllComponents(VCAlert)).toHaveLength(1);
        expect(wrapper.text()).toContain('Bericht nicht gefunden');
        expect(host.emitted('failed')?.[0]).toEqual([error]);
        expect(host.emitted('resolved')).toBeUndefined();
    });

    it('should drop the record and emit deleted on delete', async () => {
        let slotProps : ResourceRecordDefaultSlotProps<Entry> | undefined;
        const deleted : string[] = [];

        const { wrapper, host } = mountRecord({
            id: 'record-1',
            load: async (id: string) => ({ id, name: 'Bericht' }),
            remove: async (id: string) => {
                deleted.push(id);

                return { id, name: 'Bericht' };
            },
        }, { default: defaultSlot((props) => { slotProps = props; }) });

        await flushPromises();

        await slotProps?.delete();

        expect(deleted).toEqual(['record-1']);
        expect(wrapper.text()).toBe('');
        expect(host.emitted('deleted')?.[0]).toEqual([{ id: 'record-1', name: 'Bericht' }]);
    });

    it('should ignore a delete when no delete handler is given', async () => {
        let slotProps : ResourceRecordDefaultSlotProps<Entry> | undefined;

        const { wrapper, host } = mountRecord({
            id: 'record-1',
            load: async (id: string) => ({ id, name: 'Bericht' }),
        }, { default: defaultSlot((props) => { slotProps = props; }) });

        await flushPromises();

        await slotProps?.delete();

        expect(wrapper.text()).toBe('Bericht');
        expect(host.emitted('deleted')).toBeUndefined();
    });
});
