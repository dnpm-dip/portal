import { renderDefault, renderError } from '@dnpm-dip/core';
import type {
    ListLoadMeta,
    PatientFilterInput,
    PatientMatch,
} from '@dnpm-dip/core';
import type { Ref } from 'vue';
import { defineComponent, h, ref } from 'vue';
import { useRDAPIClient } from '../../composables';

export default defineComponent({
    props: {
        queryId: {
            type: String,
            required: true,
        },
    },
    setup(props, setup) {
        const api = useRDAPIClient();

        const total = ref(0);
        const limit = ref(20);
        const offset = ref(0);

        const busy : Ref<boolean> = ref(false);
        const data : Ref<PatientMatch[]> = ref([]);
        const error : Ref<Error | null> = ref(null);
        const load = async (meta: ListLoadMeta<PatientFilterInput> = {}) => {
            if (busy.value) return;

            busy.value = true;

            if (typeof meta.limit === 'undefined') {
                meta.limit = limit.value;
            }

            if (typeof meta.offset === 'undefined') {
                meta.offset = offset.value;
            }

            try {
                const response = await api.query.getPatients(props.queryId, meta);

                data.value = response.entries;

                if (typeof response.size !== 'undefined') {
                    total.value = response.size;
                }
                if (typeof response.limit !== 'undefined') {
                    limit.value = response.limit;
                }
                if (typeof response.offset !== 'undefined') {
                    offset.value = response.offset;
                }
            } catch (e) {
                if (e instanceof Error) {
                    error.value = e;
                }
            } finally {
                busy.value = false;
            }
        };

        setup.expose({
            load,
        });

        Promise.resolve()
            .then(() => load());

        return () => {
            if (error.value) {
                return renderError({ setup, error: error.value });
            }

            return renderDefault({
                load,
                setup,
                data: data.value,
                busy: busy.value,
                total: total.value,
                offset: offset.value,
                limit: limit.value,
            });
        };
    },
});
