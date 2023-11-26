import type { ResourceRecordSlots } from '@dnpm-dip/core';
import { createResourceRecordManager, defineResourceRecordEvents } from '@dnpm-dip/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { useRDAPIClient } from '../../composables';
import type { RDPreparedQuery } from '../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<RDPreparedQuery>,
        },
        entityId: {
            type: String,
        },
    },
    emits: defineResourceRecordEvents<RDPreparedQuery>(),
    slots: Object as SlotsType<ResourceRecordSlots<RDPreparedQuery>>,
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
