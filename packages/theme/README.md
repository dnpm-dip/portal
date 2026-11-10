<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/theme</h1>

<p align="center">
    <b>DNPM DIP theme for vuecs components, built on top of @vuecs/theme-tailwind.</b><br>
    One CSS import for the graphite-and-coral brand, its fonts, light and dark tokens and the portal chrome,<br>
    plus the vuecs theme that goes with it.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/theme"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Ftheme%2Fpackage.json&label=version" alt="version" /></a>
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/main.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
</p>

<p align="center">
    <a href="#installation"><b>Installation</b></a>
    ·
    <a href="#usage">Usage</a>
    ·
    <a href="#tokens">Tokens</a>
    ·
    <a href="#api">API</a>
    ·
    <a href="#notes">Notes</a>
</p>

---

## Why @dnpm-dip/theme?

The portal's components come from vuecs and `@authup/client-web-kit`, which ship a neutral, blue-primary look.
DNPM:DIP needs its own: a graphite primary, coral as the single accent, its header, sidebar and footer chrome,
and a dark mode where all of it still reads.

| Concern | Without it | With @dnpm-dip/theme |
|---|---|---|
| **Brand colours** | Override vuecs colours per component | `--vc-color-primary-*` is mixed from `--dnpm-brand-slate` once; every `primary` utility follows |
| **Dark mode** | A second set of overrides | Tokens flip under `.dark`; components need no change |
| **Chrome** | Header, navbar, sidebar and footer styles in the app | Shipped as layout styles, driven by `--dnpm-chrome-*` tokens |
| **Shared patterns** | Ad-hoc card and section styles | `.entity-card`, `.entity-card-group`, `.section-label` |
| **Authup screens** | Styled separately | Builds on `@authup/client-web-kit-theme`, so Authup's admin components match |

<p align="center">
    <img src="./assets/theme-layers.svg" alt="From the bottom: @authup/client-web-kit-theme brings tailwindcss, the @vuecs/design tokens and @vuecs/theme-tailwind. @dnpm-dip/theme adds an @theme block with the Nunito and Asap fonts, an @layer base with the --dnpm-* brand and chrome tokens, a primary scale mixed from the graphite brand colour and the .dark overrides, and the layout and component styles. The portal imports it from assets/css/tailwind.css. Brand tokens: coral #F65552, slate #2B2F36 (#C7CCD4 in dark mode), mauve #C7B1BD, silver #AEB2B5. In JavaScript, register clientWebKitTheme() before dnpmTheme() so the DNPM theme wins." width="100%" />
</p>

## Installation

```bash
npm install @dnpm-dip/theme --save
```

Peer dependencies: `tailwindcss` 4.3, `@vuecs/core` 3.6, `@vuecs/design` 1.2 and `@vuecs/theme-tailwind` 6.5.
The package ships its CSS sources (`src/index.css`, `src/styles/`) next to the built JavaScript.

## Usage

### CSS

Import the vuecs component styles first, then the theme, in your Tailwind v4 entry. This is the portal's
`assets/css/tailwind.css`:

```css
@import "@vuecs/button";
@import "@vuecs/elements";
@import "@vuecs/forms";
@import "@vuecs/navigation";
@import "@vuecs/pagination";
@import "@vuecs/placeholder";
@import "@vuecs/table";

@import "@dnpm-dip/theme";

@source "../../../vue/src";
@source "../../../mtb/src";
```

Add an `@source` line for every package whose templates use Tailwind classes, or those classes are never generated.

The theme names **Nunito** (text) and **Asap** (headings) but does not load them. The portal loads them through
`@fontsource/nunito` (300, 400, 600, 700) and `@fontsource/asap` (700) in `nuxt.config.ts`.

### JavaScript

```typescript
import vuecs from '@vuecs/core';
import dnpmTheme, { clientWebKitTheme } from '@dnpm-dip/theme';
import type { App } from 'vue';

declare const app: App;

app.use(vuecs, {
    themes: [clientWebKitTheme(), dnpmTheme()],
});
```

Order matters: the kit theme sets the baseline class strings, and `dnpmTheme()` comes second so its overrides win.

### Dark mode

Toggle the `.dark` class on `<html>`; the portal does this through `@vuecs/nuxt`'s color mode. No JavaScript
theme switch is needed.

## Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--dnpm-brand-coral` | `#F65552` | same | The one accent: logo strand, sidebar accent, footer links |
| `--dnpm-brand-slate` | `#2B2F36` | `#C7CCD4` | Graphite anchor of the primary scale |
| `--dnpm-brand-mauve` | `#C7B1BD` | same | Logo rungs, soft accents |
| `--dnpm-brand-silver` | `#AEB2B5` | same | Neutral accent |
| `--dnpm-brand-ink` | `var(--dnpm-brand-slate)` | follows slate | Brand text colour |
| `--vc-color-primary-50` … `-950` | mixed from slate | mixed from slate | Every `primary` utility and vuecs `color="primary"` |
| `--dnpm-chrome-*` | `bg`, `bg-elevated`, `bg-nested`, `fg`, `fg-muted`, `border`, `edge-shadow-*` | | Header, navbar, sidebar, footer |
| `--dnpm-navbar-menu-*` | `bg`, `bg-hover`, `fg` | | Top navigation menu |
| `--dnpm-{info,warning,danger}-surface[-border,-fg]` | | | Tinted status surfaces |

Use semantic tokens (`text-fg-muted`, `bg-bg-muted`, `border-border`, `primary-*`, `--dnpm-brand-*`) rather than
hex values, so the UI works in both modes.

## API

| Export | Kind | Purpose |
|---|---|---|
| `@dnpm-dip/theme` (CSS, via the `style` condition), `@dnpm-dip/theme/index.css` | stylesheet | The full theme (see above) |
| `default` → `dnpmTheme()` | function | vuecs theme with the DNPM overrides (table head cells today) |
| `clientWebKitTheme` | function | Re-export of `@authup/client-web-kit-theme`'s default theme |
| `merge` | function | Re-export of `@authup/client-web-kit-theme`'s theme merge helper |

**Classes**: `.entity-card`, `.entity-card-group`, `.section-label`, and the layout hooks `.page-content` and
`.page-sidebar`. The `.nav`/`.nav-pills` tab-pill chrome and a few `.text-left`/`.text-right` helpers remain from
the Bootstrap era; other Bootstrap classes (`.btn`, `.row`, `.card`, `.alert`, …) are gone. Use `<VC*>`
components and Tailwind utilities instead.

## Notes

- **A missing `@source` fails silently.** Tailwind generates only the classes it finds; a package left out of the
  scan renders unstyled, with no build error.
- **The theme does not bundle fonts.** Without the `@fontsource` imports the UI falls back to the system font.
- **Import order matters in CSS too.** Import `@dnpm-dip/theme` after the vuecs component styles so its layers
  override them.

## License

Published under [MIT License](../../LICENSE).
