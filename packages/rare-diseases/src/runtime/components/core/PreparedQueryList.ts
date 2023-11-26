import type { ResourceCollectionSlots } from '@dnpm-dip/core';
import { createResourceCollectionManager } from '@dnpm-dip/core';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { useRDAPIClient } from '../../composables';
import type { RDPreparedQuery } from '../../domains';

export default defineComponent({
    slots: Object as SlotsType<ResourceCollectionSlots<RDPreparedQuery>>,
    setup(props, setup) {
        const api = useRDAPIClient();

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
        });

        return () => manager.render();
    },
});
