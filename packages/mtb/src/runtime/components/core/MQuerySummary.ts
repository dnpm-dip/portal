import type { URLQueryRecord } from '@dnpm-dip/core';
import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { useMTBAPIClient } from '#imports';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
        queryRecord: {
            type: Object as PropType<URLQueryRecord>,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
    },
    async setup(props, setup) {
        const apiClient = useMTBAPIClient();
        const id = toRef(props, 'queryId');

        const manager = createResourceRecordManager({
            load: (id) => apiClient.query.getSummary(id, props.queryRecord),
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
