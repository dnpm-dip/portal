import { applyStoreManagerOptions, installStoreManager } from '@vuecs/form-controls/core';

import bootstrap from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';

import installFormControls from '@vuecs/form-controls';
import installTimeago from '@vuecs/timeago';
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
            defaults: {
                list: {
                    class: 'list',
                },
                listBody: {
                    class: 'list-body',
                },
                listItem: {
                    class: 'list-item',
                },
                pagination: {
                    class: 'pagination',
                    itemClass: 'page-item',
                },
            },
        });

        nuxt.vueApp.use(installFormControls);
        nuxt.vueApp.use(installTimeago);
    },
});
