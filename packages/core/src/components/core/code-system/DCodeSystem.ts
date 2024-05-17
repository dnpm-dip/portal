import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { HTTPClient } from '../../../core';
import { createResourceRecordManager, injectAPIClient } from '../../../core';

export default defineComponent({
    props: {
        code: {
            type: String,
            required: true,
        },
        lazyLoad: {
            type: Boolean,
        },
        filter: {
            type: Array as PropType<string[]>,
            default: undefined,
        },
    },
    async setup(props, setup) {
        const apiClient : HTTPClient = injectAPIClient();
        const id = toRef(props, 'code');

        const manager = createResourceRecordManager({
            load: (id) => apiClient.codeSystem.getOne(id, props.filter),
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
