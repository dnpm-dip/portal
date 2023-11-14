import { defineComponent } from 'vue';
import type { APIClient } from '../../core';
import { createResourceRecordManager, injectAPIClient } from '../../core';

export default defineComponent({
    name: 'CodeSystemEntity',
    props: {
        code: {
            type: String,
            required: true,
        },
        lazyLoad: {
            type: Boolean,
        },
    },
    async setup(props, setup) {
        const apiClient : APIClient = injectAPIClient();

        const manager = createResourceRecordManager({
            load: () => apiClient.codeSystem.getOne(props.code),
            slots: setup.slots,
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
