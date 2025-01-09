import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type {
    ResourceCollectionSlots,
} from '../../../core';
import {
    createResourceCollectionManager,
    defineResourceCollectionEvents,
    injectHTTPClient,
} from '../../../core';
import type { PreparedQuery } from '../../../domains';
import { PreparedQueryAPI } from '../../../domains';

export default defineComponent({
    slots: Object as SlotsType<ResourceCollectionSlots<PreparedQuery>>,
    props: {
        useCase: {
            type: String,
            required: true,
        },
    },
    emits: defineResourceCollectionEvents<PreparedQuery>(),
    setup(props, setup) {
        const api = injectHTTPClient();
        const preparedQueryAPI = new PreparedQueryAPI({ client: api, useCase: props.useCase });

        const manager = createResourceCollectionManager({
            load: async () => {
                const response = await preparedQueryAPI.getMany();

                return {
                    data: response.entries,
                    total: response.size,
                };
            },
            slots: setup.slots,
            expose: setup.expose,
            emit: setup.emit,
        });

        return () => manager.render();
    },
});
