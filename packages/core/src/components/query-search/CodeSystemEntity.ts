import { defineComponent, h } from 'vue';
import type { APIClient } from '../../core';
import { injectAPIClient } from '../../core';
import { AlertError } from '../alert';
import { renderContent, renderError } from '../utils';

export default defineComponent({
    name: 'CodeSystemEntity',
    props: {
        code: {
            type: String,
            required: true,
        },
    },
    async setup(props, setup) {
        const apiClient : APIClient = injectAPIClient();

        try {
            const data = await apiClient.codeSystem.getOne(props.code);

            return () => renderContent({ setup, data });
        } catch (e) {
            return () => renderError({
                setup,
                error: e as Error,
                alt: (error) => h(AlertError, { error }),
            });
        }
    },
});
