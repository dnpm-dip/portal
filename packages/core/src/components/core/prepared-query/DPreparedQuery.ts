import type { PropType, SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type {
    ResourceRecordSlots,
} from '../../../core';
import {
    createResourceRecordManager,
    defineResourceRecordEvents,
    injectHTTPClient,
} from '../../../core';
import type { PreparedQuery } from '../../../domains';
import { PreparedQueryAPI } from '../../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<PreparedQuery>,
        },
        entityId: {
            type: String,
        },
        useCase: {
            type: String,
            required: true,
        },
    },
    emits: defineResourceRecordEvents<PreparedQuery>(),
    slots: Object as SlotsType<ResourceRecordSlots<PreparedQuery>>,
    async setup(props, setup) {
        const api = injectHTTPClient();
        const preparedQueryAPI = new PreparedQueryAPI({ client: api, useCase: props.useCase });
        const id = toRef(props, 'entityId');
        const data = toRef(props, 'entity');

        const manager = createResourceRecordManager({
            load: async (id) => preparedQueryAPI.getOne(id),
            delete: async (id) => preparedQueryAPI.delete(id),
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
