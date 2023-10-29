import { defineComponent, h } from 'vue';
import type { APIClient } from '../../core';
import { injectAPIClient } from '../../core';
import { AlertError } from '../alert';
import { renderDefault, renderError } from '../utils';

export default defineComponent({
    name: 'ValueSetEntity',
    props: {
        code: {
            type: String,
            required: true,
        },
    },
    async setup(props, setup) {
        const apiClient : APIClient = injectAPIClient();

        try {
            const data = await apiClient.valueSet.getOne(props.code);

            return () => renderDefault({ setup, data });
        } catch (e) {
            return () => renderError({
                setup,
                error: e as Error,
                template: () => h(AlertError, { error: e as Error }),
            });
        }
    },
});
