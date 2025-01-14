import type { ResourceRecordSlots } from '@dnpm-dip/core';
import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import type { SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { PatientRecord } from '../../../domains';
import { injectHTTPClient } from '../../../core/http-client';

export default defineComponent({
    props: {
        id: {
            type: String,
            required: true,
        },
        lazyLoad: {
            type: Boolean,
            default: false,
        },
    },
    slots: Object as SlotsType<ResourceRecordSlots<PatientRecord>>,
    async setup(props, setup) {
        const apiClient = injectHTTPClient();
        const id = toRef(props, 'id');

        const manager = createResourceRecordManager({
            load: () => apiClient.validation.getReport(props.id),
            slots: setup.slots,
            id,
        });

        if (props.lazyLoad) {
            Promise.resolve()
                .then(() => manager.load());
        } else {
            await manager.load();
        }

        return () => manager.render();
    },
});
