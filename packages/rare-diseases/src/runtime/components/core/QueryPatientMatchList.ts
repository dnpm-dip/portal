import { renderDefault, renderError } from '@dnpm-dip/core';
import type {
    PatientFilterInput, PatientMatch,
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

        const busy : Ref<boolean> = ref(false);
        const data : Ref<PatientMatch[]> = ref([]);
        const error : Ref<Error | null> = ref(null);
        const load = async (filters?: PatientFilterInput) => {
            if (busy.value) return;

            busy.value = true;

            try {
                const { entries } = await api.query.getPatients(props.queryId, filters);
                data.value = entries;
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
            });
        };
    },
});
