import type { ResourceCollectionSlots } from '@dnpm-dip/core';
import { createResourceCollectionManager, defineResourceCollectionEvents } from '@dnpm-dip/core';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { injectHTTPClient } from '../../core';
import type { PreparedQuery } from '../../domains';

export default defineComponent({
    slots: Object as SlotsType<ResourceCollectionSlots<PreparedQuery>>,
    emits: defineResourceCollectionEvents<PreparedQuery>(),
    setup(props, setup) {
        const api = injectHTTPClient();

        const manager = createResourceCollectionManager({
            load: async (meta) => {
                const response = await api.preparedQuery.getMany();

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
