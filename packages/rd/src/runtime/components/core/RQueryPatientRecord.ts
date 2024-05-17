import type { ResourceRecordSlots } from '@dnpm-dip/core';
import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import type { SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { injectHTTPClient } from '../../core';
import type { PatientRecord } from '../../domains';

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
    slots: Object as SlotsType<ResourceRecordSlots<PatientRecord>>,
    async setup(props, setup) {
        const apiClient = injectHTTPClient();
        const id = toRef(props, 'queryId');

        const manager = createResourceRecordManager({
            load: () => apiClient.query.getPatientRecord(props.queryId, props.patientId),
            slots: setup.slots,
            id,
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
