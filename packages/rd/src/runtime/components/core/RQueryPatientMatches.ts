import type { ObjectLiteral } from '@dnpm-dip/kit';
import type { PatientMatchBase } from '@dnpm-dip/http-kit';
import type { ResourceCollectionSlots } from '@dnpm-dip/vue';
import { createResourceCollectionManager } from '@dnpm-dip/vue';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { injectHTTPClient } from '../../core';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
        filters: { type: Object as PropType<ObjectLiteral> },
    },
    slots: Object as SlotsType<ResourceCollectionSlots<PatientMatchBase>>,
    setup(props, setup) {
        const api = injectHTTPClient();

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
