import { defineComponent, toRef } from 'vue';
import type { APIClient } from '../../../core';
import { createResourceRecordManager, injectAPIClient } from '../../../core';

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
        const id = toRef(props, 'code');

        const manager = createResourceRecordManager({
            load: (id) => apiClient.codeSystem.getOne(id),
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
