import { injectTranslatorLocale } from '@authup/client-web-kit';
import { de } from 'date-fns/locale/de';
import { watch } from 'vue';

import vuecs from '@vuecs/core';
import dnpmTheme, { clientWebKitTheme } from '@dnpm-dip/theme';
import installButton from '@vuecs/button';
import installElements from '@vuecs/elements';
import installForms from '@vuecs/forms';
import installNavigation from '@vuecs/navigation';
import installOverlays from '@vuecs/overlays';
import installPagination from '@vuecs/pagination';
import installPlaceholder from '@vuecs/placeholder';
import installTable from '@vuecs/table';
import installTimeago, { injectLocale as injectTimeagoLocale } from '@vuecs/timeago';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
    name: 'vuecs',
    dependsOn: ['authup'],
    async setup(nuxt) {
        const app = nuxt.vueApp;

        app.use(vuecs, {
            themes: [clientWebKitTheme(), dnpmTheme()],
            icons: [],
        });

        app.use(installButton);
        app.use(installElements);
        app.use(installForms);
        app.use(installNavigation);
        app.use(installOverlays);
        app.use(installPagination);
        app.use(installPlaceholder);
        app.use(installTable);
        app.use(installTimeago, { locales: { de } });

        const locale = injectTranslatorLocale();
        locale.value = 'de';

        const timeagoLocale = injectTimeagoLocale();
        timeagoLocale.value = locale.value;
        watch(locale, (val) => {
            timeagoLocale.value = val;
        });
    },
});
