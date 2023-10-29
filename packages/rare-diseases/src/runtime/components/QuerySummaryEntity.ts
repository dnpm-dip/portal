import {
    AlertError, renderDefault, renderError, renderLoading,
} from '@dnpm-dip/core';
import { defineComponent, h, ref } from 'vue';
import type { QuerySummary } from '@dnpm-dip/core';
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

        const error = ref<null | Error>(null);
        const busy = ref(false);
        const data = ref<null | QuerySummary>(null);

        const load = async () => {
            try {
                data.value = await apiClient.query.getSummary(props.queryId);
            } catch (e) {
                if (e instanceof Error) {
                    error.value = e;
                }
            }
        };

        if (props.lazy) {
            Promise.resolve()
                .then(() => load());
        } else {
            await load();
        }

        return () => {
            if (error.value) {
                return renderError({
                    setup,
                    error: error.value,
                    template: () => h(AlertError, { error: error.value }),
                });
            }

            if (data.value) {
                return renderDefault({
                    setup,
                    data: data.value,
                    busy: busy.value,
                });
            }

            return renderLoading({
                setup,
            });
        };
    },
});
