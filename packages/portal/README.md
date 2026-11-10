<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/portal</h1>

<p align="center">
    <b>Portal of DNPM DIP.</b><br>
    The Nuxt 4 application that ships as the Docker image: sign-in, layout and navigation,<br>
    with the admin, MTB and RD modules built in.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/portal"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fportal%2Fpackage.json&label=version" alt="version" /></a>
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/main.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
</p>

<p align="center">
    <a href="#running-it"><b>Running it</b></a>
    ·
    <a href="#plugins">Plugins</a>
    ·
    <a href="#structure">Structure</a>
    ·
    <a href="#notes">Notes</a>
</p>

---

This package is private and is not published to npm. Deployment, runtime configuration and the sign-in flow are
documented in the [root README](../../README.md#usage).

## Running it

```bash
npm run dev --workspace=packages/portal       # development server with HMR
npm run build --workspace=packages/portal     # nuxt build && nuxt typecheck
npm run start --workspace=packages/portal     # node .output/server/index.mjs
npm run test --workspace=packages/portal      # nuxt prepare && vitest
```

`npm run dev` at the repository root starts the same development server.

| Runtime config | Environment variable | Default |
|---|---|---|
| `public.apiUrl` | `NUXT_PUBLIC_API_URL` | `https://dnpm-dip.net/api/` |
| `apiUrl` (server only) | `NUXT_API_URL` | falls back to `public.apiUrl` |
| `public.authupUrl` | `NUXT_PUBLIC_AUTHUP_URL` | `https://dnpm-dip.net/auth/` |
| `public.authupClientId` | `NUXT_PUBLIC_AUTHUP_CLIENT_ID` | `admin-console` |
| `public.authupRealmId` | `NUXT_PUBLIC_AUTHUP_REALM_ID` | `master` |
| `public.accountUrl` | `NUXT_PUBLIC_ACCOUNT_URL` | `<authupUrl>/console/account` |
| `public.cookieDomain` | `NUXT_PUBLIC_COOKIE_DOMAIN` | — |

At build time the same keys read `API_URL`, `AUTHUP_URL`, `AUTHUP_CLIENT_ID`, `AUTHUP_REALM_ID`, `ACCOUNT_URL` and
`COOKIE_DOMAIN`.

## Plugins

The portal is a thin shell. Most of what it does happens in its Nuxt plugins, and their `dependsOn` order is
what makes the modules work:

<p align="center">
    <img src="./assets/plugin-chain.svg" alt="The Authup Nuxt module comes first. dnpm:ilingo, dnpm:kit and dnpm:permission run after it. vuecs runs after Authup and dnpm:ilingo. dnpm:kit calls install() from @dnpm-dip/vue to provide the HTTP client and the query stores; dnpm:register and the query-session-store plugin run after it. Each feature module (admin, mtb, rd) adds an api plugin that runs after dnpm:kit and a register plugin that runs after dnpm:register. The chartjs plugin has no dependencies." width="100%" />
</p>

| Plugin | Runs after | Does |
|---|---|---|
| `@authup/client-web-nuxt` (module) | — | Session, token refresh, login callback and route permission checks. Cookies are prefixed `dnpm_` |
| `dnpm:ilingo` (`plugins/ilingo.ts`) | Authup | `@ilingo/vue` with an in-memory de/en catalog (the HGVS validation message), plus `@ilingo/validup-vue` |
| `vuecs` (`plugins/vuecs.ts`) | Authup, `dnpm:ilingo` | `@vuecs/core` with `[clientWebKitTheme(), dnpmTheme()]`, Font Awesome icons, locale `de`, and the vuecs component packages |
| `dnpm:kit` (`plugins/kit.ts`) | Authup | `install()` from [`@dnpm-dip/vue`](../vue): the API client with the Authup token, the query event bus and stores |
| `dnpm:permission` (`plugins/permission.ts`) | Authup | Lets a permission check without an owner accept the global definition, or else the one the session's realm owns |
| `dnpm:register` (`plugins/register.ts`) | `dnpm:kit` | Listens on the `register` hook; adds each module to the top bar and sidebar and to `useModuleStore()` |
| `query-session-store` (`plugins/query-session-store.ts`) | `dnpm:kit` | On `SESSION_EXPIRING`, refetches the query and tracks it again; emits `SESSION_REFRESH_FAILED` if that fails |
| `chartjs` (`plugins/chartjs.ts`) | — | Registers the Chart.js controllers, elements and scales the charts use |

A feature module adds its own `api` plugin (after `dnpm:kit`) and `register` plugin (after `dnpm:register`); see
the [root README](../../README.md#why-the-portal).

## Structure

| Path | Contents |
|---|---|
| `nuxt.config.ts` | Modules (Authup, `../admin/src/module`, `../mtb/src/module`, `../rd/src/module`, `@vuecs/nuxt`), runtime config, CSS, icon bundle |
| `pages/` | `index`, `login/index`, `login/callback` (client-only), `logout` |
| `layouts/` | `default` (header, sidebar, footer, toast and alert-dialog hosts) and `auth` |
| `components/` | Header, footer, sidebar, about modal, `ModuleMetaCard`, the sign-in background (`auth/`) and the logo (`svg/`) |
| `core/` | Account console URL (`useAccountConsoleURL`) and navigation |
| `stores/modules.ts` | `useModuleStore`, the registered modules |
| `assets/css/tailwind.css` | Tailwind entry: vuecs styles, `@dnpm-dip/theme`, and an `@source` line per package |

The sibling packages `kit`, `http-kit`, `vue` and `nuxt-kit` are aliased to their `src/` folders, and the modules are
loaded from source, so the portal never builds against a stale `dist/`.

## Notes

- **The overlay hosts in `layouts/default.vue` are required.** `useToast()` and Authup's confirm dialogs only queue
  requests; without `<VCToastProvider>`/`<VCToaster>` and `<VCAlertDialogProvider>` toasts never appear and confirm
  buttons do nothing, with no error. A new layout that renders those components must mount the same hosts.
- **Icons are bundled from a scan.** `NuxtIconBundle` ships only the `fa6-*` icons it finds in the paths listed in
  `nuxt.config.ts`. A new package or directory that names icons must be added there, or its icons render empty.
  Check the build log line `Nuxt Icon bundled N icons`.
- **Permission names stay bare.** Write `mtb_query_submit`, not an owner-qualified name; `dnpm:permission` resolves
  the owner.

## License

Published under [MIT License](../../LICENSE).
