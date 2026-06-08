import { buildSubmitButtonDefaults, injectTranslatorLocale } from '@authup/client-web-kit';
import { createValidup } from '@validup/vue';
import { OptionalValue } from 'validup';
import { de } from 'date-fns/locale/de';
import { watch } from 'vue';

import vuecs from '@vuecs/core';
import dnpmTheme, { clientWebKitTheme } from '@dnpm-dip/theme';
import fontAwesome from '@vuecs/icons-font-awesome';
import { addCollection } from '@iconify/vue';
import faBrands from '@iconify-json/fa6-brands/icons.json';
import faSolid from '@iconify-json/fa6-solid/icons.json';
import installButton from '@vuecs/button';
import installElements from '@vuecs/elements';
import installForms from '@vuecs/forms';
import installIcon from '@vuecs/icon';
import installNavigation from '@vuecs/navigation';
import installOverlays from '@vuecs/overlays';
import installPagination from '@vuecs/pagination';
import installPlaceholder from '@vuecs/placeholder';
import installTable from '@vuecs/table';
import installTimeago, { injectLocale as injectTimeagoLocale } from '@vuecs/timeago';

import { defineNuxtPlugin } from '#app';

addCollection(faSolid);
addCollection(faBrands);

export default defineNuxtPlugin({
    name: 'vuecs',
    dependsOn: ['authup', 'dnpm:ilingo'],
    async setup(nuxt) {
        const app = nuxt.vueApp;

        app.use(vuecs, {
            themes: [clientWebKitTheme(), dnpmTheme()],
            icons: [fontAwesome()],
            defaults: { submitButton: buildSubmitButtonDefaults() },
        });

        app.use(createValidup({
            optionalValue: [OptionalValue.UNDEFINED, OptionalValue.NULL, OptionalValue.EMPTY_STRING],
            optionalAs: null,
        }));

        app.use(installButton);
        app.use(installElements);
        app.use(installForms);
        app.use(installNavigation);
        app.use(installOverlays);
        app.use(installPagination);
        app.use(installPlaceholder);
        app.use(installTable);
        app.use(installTimeago, { locales: { de } });
        app.use(installIcon);

        const locale = injectTranslatorLocale();
        locale.value = 'de';

        const timeagoLocale = injectTimeagoLocale();
        timeagoLocale.value = locale.value;
        watch(locale, (val) => {
            timeagoLocale.value = val;
        });
    },
});
