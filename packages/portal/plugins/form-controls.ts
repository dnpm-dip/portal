import { applyStoreManagerOptions, installStoreManager } from '@vuecs/form-controls/core';

import bootstrap from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';

import install from '@vuecs/form-controls';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(nuxt) {
        const storeManager = installStoreManager(nuxt.vueApp);
        applyStoreManagerOptions(storeManager, {
            presets: {
                bootstrap,
                fontAwesome,
            },
        });

        nuxt.vueApp.use(install);
    },
});
