import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { ResourceRecordSlots } from '@dnpm-dip/core';
import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import { injectHTTPClient } from '../core';
import type { ConnectionReport } from '../domains';

export default defineComponent({
    props: {
        lazyLoad: {
            type: Boolean,
        },
    },
    slots: Object as SlotsType<ResourceRecordSlots<ConnectionReport>>,
    async setup(props, setup) {
        const apiClient = injectHTTPClient();

        const manager = createResourceRecordManager({
            load: () => apiClient.getConnectionReport(),
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
