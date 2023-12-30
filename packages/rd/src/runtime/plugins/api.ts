import { RDAPIClient } from '../core/api-client';
import { defineNuxtPlugin } from '#app';
import { useAPIClient } from '../composables';

export default defineNuxtPlugin({
    enforce: 'post',
    async setup(nuxt) {
        const baseClient = useAPIClient();

        const client = new RDAPIClient(baseClient);

        return {
            provide: {
                rdApi: client,
            },
        };
    },
});
