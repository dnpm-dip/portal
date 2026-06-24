import { defineTheme } from '@vuecs/core';

export { default as clientWebKitTheme, merge } from '@authup/client-web-kit-theme';

/**
 * App-level theme. Layers DNPM DIP app-specific concerns (Bootstrap-compat
 * class shims, heading scale, brand tokens) on top of the kit theme.
 *
 * Consumers register both themes — order matters: the kit-level theme
 * first so its element class strings are the baseline, then the app
 * theme so its overrides win:
 *
 *     import clientWebKitTheme from '@authup/client-web-kit-theme';
 *     import dnpmTheme from '@dnpm-dip/theme';
 *
 *     app.use(vuecs, {
 *         themes: [clientWebKitTheme(), dnpmTheme()],
 *     });
 *
 * Reskinning (palette swap, dark mode) is handled by redefining
 * `--vc-color-*` variables — `setColorPalette()` from
 * `@vuecs/theme-tailwind` or toggling `.dark` on `<html>` works without
 * any theme configuration here.
 */
export default function dnpmTheme() {
    return defineTheme({ elements: { tableHeadCell: { classes: { root: 'px-3 font-medium' } } } });
}
