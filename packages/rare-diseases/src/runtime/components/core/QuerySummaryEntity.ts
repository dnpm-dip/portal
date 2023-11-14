import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import { defineComponent } from 'vue';
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

        const manager = createResourceRecordManager({
            load: () => apiClient.query.getSummary(props.queryId),
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
