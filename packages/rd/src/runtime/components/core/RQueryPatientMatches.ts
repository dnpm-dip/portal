import type { ObjectLiteral, PatientMatchBase, ResourceCollectionSlots } from '@dnpm-dip/core';
import { createResourceCollectionManager } from '@dnpm-dip/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { useRDAPIClient } from '../../composables';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
        filters: {
            type: Object as PropType<ObjectLiteral>,
        },
    },
    slots: Object as SlotsType<ResourceCollectionSlots<PatientMatchBase>>,
    setup(props, setup) {
        const api = useRDAPIClient();

        const filters = toRef(props, 'filters');

        const manager = createResourceCollectionManager({
            load: async (meta) => {
                const response = await api.query.getPatients(props.queryId, meta);

                return {
                    data: response.entries,
                    total: response.size,
                };
            },
            slots: setup.slots,
            expose: setup.expose,
            filters,
        });

        return () => manager.render();
    },
});
