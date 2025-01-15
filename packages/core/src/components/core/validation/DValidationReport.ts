import type { SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { ResourceRecordSlots } from '../../../core';
import {
    createResourceRecordManager,
    injectHTTPClient,
} from '../../../core';
import { ValidationAPI } from '../../../domains';
import type { ValidationReport } from '../../../domains';

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
        useCase: {
            type: String,
            required: true,
        },
    },
    slots: Object as SlotsType<ResourceRecordSlots<ValidationReport>>,
    async setup(props, setup) {
        const api = injectHTTPClient();
        const validationAPI = new ValidationAPI({ client: api, useCase: props.useCase });
        const id = toRef(props, 'id');

        const manager = createResourceRecordManager({
            load: () => validationAPI.getReport(props.id),
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
