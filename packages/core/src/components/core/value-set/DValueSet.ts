import type { PropType, SlotsType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { HTTPClient, ResourceRecordSlots } from '../../../core';
import {
    createResourceRecordManager,
    injectAPIClient,
} from '../../../core';
import type { ValueSet } from '../../../domains';

export default defineComponent({
    props: {
        code: {
            type: String,
            required: true,
        },
        lazyLoad: {
            type: Boolean,
        },
        version: {
            type: String,
        },
        filter: {
            type: Array as PropType<string[]>,
            default: undefined,
        },
    },
    slots: Object as SlotsType<ResourceRecordSlots<ValueSet>>,
    async setup(props, setup) {
        const apiClient : HTTPClient = injectAPIClient();
        const id = toRef(props, 'code');

        const manager = createResourceRecordManager({
            load: (id) => apiClient.valueSet.getOne(id, props.version, props.filter),
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
