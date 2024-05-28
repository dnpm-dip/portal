import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { ResourceRecordSlots } from '../../../core';
import {
    createResourceRecordManager,
    injectHTTPClient,
} from '../../../core';
import type { AdminConnectionReport } from '../../../domains';

export default defineComponent({
    props: {
        lazyLoad: {
            type: Boolean,
        },
    },
    slots: Object as SlotsType<ResourceRecordSlots<AdminConnectionReport>>,
    async setup(props, setup) {
        const apiClient = injectHTTPClient();

        const manager = createResourceRecordManager({
            load: () => apiClient.admin.getConnectionReport(),
            slots: setup.slots,
            id: 'connection-report',
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
