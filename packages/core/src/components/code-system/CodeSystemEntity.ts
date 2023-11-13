import { defineComponent, h, ref } from 'vue';
import type { APIClient } from '../../core';
import { injectAPIClient } from '../../core';
import type { CodeSystem } from '../../domains';
import { AlertError } from '../alert';
import { renderDefault, renderError, renderLoading } from '../../core/utils';

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

        const error = ref<null | Error>(null);
        const busy = ref(false);
        const data = ref<null | CodeSystem>(null);

        const load = async () => {
            try {
                data.value = await apiClient.codeSystem.getOne(props.code);
            } catch (e) {
                if (e instanceof Error) {
                    error.value = e;
                }
            }
        };

        if (props.lazyLoad) {
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
                    template: () => h(AlertError, { error: error.value as Error }),
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
