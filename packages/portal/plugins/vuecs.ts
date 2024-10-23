import { injectTranslatorLocale } from '@authup/client-web-kit';
import installTimeago, { injectLocale as injectTimeagoLocale } from '@vuecs/timeago';
import { de } from 'date-fns/locale/de';
import { applyStoreManagerOptions, installStoreManager } from '@vuecs/form-controls/core';

import bootstrap from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';
import { install as installPagination } from '@vuecs/pagination';
import installFormControls from '@vuecs/form-controls';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
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

        installPagination(nuxt.vueApp);

        nuxt.vueApp.use(installFormControls);
        nuxt.vueApp.use(installTimeago, {
            locales: {
                de,
            },
        });

        const locale = injectTranslatorLocale();
        locale.value = 'de';

        const timeagoLocale = injectTimeagoLocale();
        timeagoLocale.value = locale.value;
        watch(locale, (val) => {
            timeagoLocale.value = val;
        });
    },
});
