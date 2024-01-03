import { MTBAPIClient } from '../core/api-client';
import { useAPIClient } from '../composables';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    enforce: 'post',
    async setup(nuxt) {
        const baseClient = useAPIClient();

        const client = new MTBAPIClient(baseClient);

        return {
            provide: {
                mtbApi: client,
            },
        };
    },
});
