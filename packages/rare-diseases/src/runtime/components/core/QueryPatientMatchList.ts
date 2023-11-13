import type { PatientMatch, ResourceCollectionSlots } from '@dnpm-dip/core';
import { createResourceCollectionManager } from '@dnpm-dip/core';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { useRDAPIClient } from '../../composables';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
    },
    slots: Object as SlotsType<ResourceCollectionSlots<PatientMatch>>,
    setup(props, setup) {
        const api = useRDAPIClient();

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
        });

        return () => manager.render();
    },
});
