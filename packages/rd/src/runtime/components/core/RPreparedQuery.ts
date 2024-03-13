import type { ResourceRecordSlots } from '@dnpm-dip/core';
import { createResourceRecordManager, defineResourceRecordEvents } from '@dnpm-dip/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { useRDAPIClient } from '../../composables';
import type { PreparedQuery } from '../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<PreparedQuery>,
        },
        entityId: {
            type: String,
        },
    },
    emits: defineResourceRecordEvents<PreparedQuery>(),
    slots: Object as SlotsType<ResourceRecordSlots<PreparedQuery>>,
    async setup(props, setup) {
        const api = useRDAPIClient();
        const id = toRef(props, 'entityId');
        const data = toRef(props, 'entity');

        const manager = createResourceRecordManager({
            load: async (id) => api.preparedQuery.getOne(id),
            delete: async (id) => api.preparedQuery.delete(id),
            slots: setup.slots,
            expose: setup.expose,
            data,
            id,
            emit: setup.emit,
        });

        await manager.load();

        return () => manager.render();
    },
});
