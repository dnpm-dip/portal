import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { APIClient, ResourceRecordSlots } from '../../core';
import {
    createResourceRecordManager,
    injectAPIClient,
} from '../../core';
import type { ValueSet } from '../../domains';

export default defineComponent({
    name: 'ValueSetEntity',
    props: {
        code: {
            type: String,
            required: true,
        },
        lazyLoad: {
            type: Boolean,
        },
    },
    slots: Object as SlotsType<ResourceRecordSlots<ValueSet>>,
    async setup(props, setup) {
        const apiClient : APIClient = injectAPIClient();

        const manager = createResourceRecordManager({
            load: () => apiClient.valueSet.getOne(props.code),
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
