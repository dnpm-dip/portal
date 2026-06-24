import { buildSubmitButtonDefaults, injectTranslatorLocale } from '@authup/client-web-kit';
import { createValidup } from '@validup/vue';
import { OptionalValue } from 'validup';
import { de } from 'date-fns/locale/de';

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
import installTimeago from '@vuecs/timeago';

import { defineNuxtPlugin } from '#app';

addCollection(faSolid);
addCollection(faBrands);

export default defineNuxtPlugin({
    name: 'vuecs',
    dependsOn: ['authup', 'dnpm:ilingo'],
    async setup(nuxt) {
        const app = nuxt.vueApp;

        // The ilingo locale provider is installed by the `authup` plugin
        // chain this plugin `dependsOn`. Bridge the active ilingo locale
        // into vuecs's `Config['locale']` as a reactive ref; @vuecs/timeago
        // 2.1+ reads the active locale via `useLocale()` — its per-package
        // `injectLocale()` ref was removed.
        const locale = injectTranslatorLocale();
        locale.value = 'de';

        app.use(vuecs, {
            themes: [clientWebKitTheme(), dnpmTheme()],
            icons: [fontAwesome()],
            config: { locale },
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
        // Register the date-fns German locale so timeago can format relative
        // times in German when the active locale (driven by `config.locale`
        // above) is `de`.
        app.use(installTimeago, { locales: { de } });
        app.use(installIcon);
    },
});
