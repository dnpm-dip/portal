import bootstrap from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';

import install from '@vuecs/form-controls';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(nuxt) {
        nuxt.vueApp.use(install, {
            storeManager: {
                presets: {
                    bootstrap,
                    fontAwesome,
                },
            },
        });
    },
});
