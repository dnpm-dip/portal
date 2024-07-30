import type { URLQueryRecord } from '@dnpm-dip/core';
import {
    createResourceRecordManager,
} from '@dnpm-dip/core';
import { type PropType, nextTick, watch } from 'vue';
import { defineComponent, toRef } from 'vue';
import { injectHTTPClient } from '../../core/http-client';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
        queryFilters: {
            type: Object as PropType<URLQueryRecord>,
        },
        queryUpdatedAt: {
            type: String,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
    },
    async setup(props, setup) {
        const apiClient = injectHTTPClient();
        const id = toRef(props, 'queryId');
        const filters = toRef(props, 'queryFilters');
        const updatedAt = toRef(props, 'queryUpdatedAt');

        const manager = createResourceRecordManager({
            load: (id) => apiClient.query.getMedication(id, props.queryFilters),
            slots: setup.slots,
            id,
        });

        watch(filters, () => {
            nextTick(() => {
                manager.load(true);
            });
        }, { deep: true });

        watch(updatedAt, () => {
            nextTick(() => {
                manager.load(true);
            });
        });

        setup.expose({
            load: (reset?: boolean) => manager.load(reset),
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
