import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import { defineComponent, toRef } from 'vue';
import { useRDAPIClient } from '#imports';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
    },
    async setup(props, setup) {
        const apiClient = useRDAPIClient();
        const id = toRef(props, 'queryId');

        const manager = createResourceRecordManager({
            load: (id) => apiClient.query.getSummary(id),
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
