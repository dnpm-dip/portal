import type { ResourceRecordSlots } from '@dnpm-dip/core';
import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { useRDAPIClient } from '#imports';
import type { RDPatientRecord } from '../../domains';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
        patientId: {
            type: String,
            required: true,
        },
        // todo: rename to lazyLoad
        lazy: {
            type: Boolean,
            default: false,
        },
    },
    slots: Object as SlotsType<ResourceRecordSlots<RDPatientRecord>>,
    async setup(props, setup) {
        const apiClient = useRDAPIClient();

        const manager = createResourceRecordManager({
            load: () => apiClient.query.getPatientRecord(props.queryId, props.patientId),
            slots: setup.slots,
        });

        if (props.lazy) {
            Promise.resolve()
                .then(() => manager.load());
        } else {
            await manager.load();
        }

        return () => manager.render();
    },
});
