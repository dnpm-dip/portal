<p align="center">
    <img src="./.github/assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="128" height="128" />
</p>

<h1 align="center">DNPM:DIP Portal</h1>

<p align="center">
    <b>The web interface of the DNPM:DIP data platform for Molecular Tumor Boards and Rare Diseases.</b><br>
    Search patients locally or across all sites, read result summaries and patient records, review validation reports<br>
    and administer users, roles and clients, all behind one Authup sign-in.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/main.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/codeql.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/codeql.yml/badge.svg" alt="CodeQL" /></a>
    <a href="https://snyk.io/test/github/dnpm-dip/portal"><img src="https://snyk.io/test/github/dnpm-dip/portal/badge.svg" alt="Known vulnerabilities" /></a>
    <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white" alt="Conventional Commits" /></a>
</p>

<p align="center">
    <a href="#packages"><b>Packages</b></a>
    ·
    <a href="#usage">Usage</a>
    ·
    <a href="#configuration">Configuration</a>
    ·
    <a href="#authentication">Authentication</a>
    ·
    <a href="#development">Development</a>
</p>

---

## Why the portal?

The DNPM:DIP backend answers federated queries over genomic and clinical data from every participating site.
Its REST API alone leaves each site to build the same things: a sign-in, search forms for MTB and RD criteria,
views for result summaries and patient records, permission handling, and a way to see which peer sites are reachable.

The portal is that interface, built once for every site:

| Concern | With the API alone | With the portal |
|---|---|---|
| **Searching patients** | Post criteria JSON to `mtb/queries` or `rd/queries` and page through the raw responses | Search forms for MTB (`MSearchForm`) and RD (`RSearchForm`), local (own site) or federated (all sites) |
| **Reading results** | Call `demographics`, `tumor-diagnostics`, `medication`, `patient-matches`, … one by one | Summary tabs with charts, Kaplan-Meier survival statistics, patient lists and full patient records |
| **Query lifetime** | A query expires on the backend after `expiresAfter` and the next request fails | The query session store refetches the query 5 minutes before it expires |
| **Sign-in** | Implement OAuth2 with PKCE against Authup yourself | Authorization Code flow through `@authup/client-web-nuxt`, session cookies prefixed `dnpm_` |
| **Who sees what** | Hide links per role by hand | Every menu entry and page names its permissions (`mtb_query_submit`, `rd_validation_report_read`, …) |
| **Data quality** | Read validation reports from the API | *Validierungsmeldungen* pages per use case |
| **Administration** | Separate tools for users, roles and peer status | Authup users, roles, clients and identity providers, plus a connection report of all peer sites |
| **A new use case** | Fork the app | A Nuxt module with three calls in `module.ts` |

Each use case is a Nuxt module that the portal loads at build time. This is the whole module definition of MTB
(`packages/mtb/src/module.ts`):

```typescript
export default defineNuxtModule({
    meta: { name: '@dnpm-dip/mtb', configKey: 'mtb' },
    defaults: {},
    async setup() {
        const resolver = createResolver(import.meta.url);

        await registerPages({ baseURL: '/mtb/', rootDir: import.meta.url });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
        addPlugin(resolver.resolve('./runtime/plugins/register'));
    },
});
```

<p align="center">
    <img src="./.github/assets/module-registration.svg" alt="How a feature module plugs into the portal. The mtb Nuxt module does three things in module.ts. First, registerPages from @dnpm-dip/nuxt-kit turns runtime/pages into routes under /mtb at build time. Second, its api plugin runs after the portal plugin dnpm:kit, wraps the base HTTP client that carries the Authup bearer token in an MTBAPIClient, and calls the DNPM:DIP API at mtb/queries. Third, its register plugin runs after dnpm:register and calls the register hook with the name MTB, the base URL /mtb/ and menu items; the portal adds MTB to the top bar and shows the Suche entry only with mtb_query_submit. admin and rd do the same." width="100%" />
</p>

**Table of Contents**

- [Packages](#packages)
- [Usage](#usage)
  - [Production](#production)
  - [Configuration](#configuration)
  - [Authentication](#authentication)
  - [Account & self-service](#account--self-service)
  - [Development](#development)
- [Credits](#credits)
- [License](#license)

## Packages

The repository is an npm-workspaces monorepo. Lower layers never import from higher ones:
`kit` ← `http-kit` ← `vue` ← `admin` / `mtb` / `rd` ← `portal`.

| Package | Version | Description |
|---|---|---|
| [`@dnpm-dip/kit`](./packages/kit) | ![kit version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fkit%2Fpackage.json&label=) | Framework-free utilities (no Vue, no Nuxt) shared by the other packages |
| [`@dnpm-dip/http-kit`](./packages/http-kit) | ![http-kit version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fhttp-kit%2Fpackage.json&label=) | HTTP client, domain models and `I*API` interfaces for the DNPM:DIP API, plus a fake client for tests |
| [`@dnpm-dip/vue`](./packages/vue) | ![vue version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fvue%2Fpackage.json&label=) | Vue components, composables, stores and services shared by the portal and its modules |
| [`@dnpm-dip/nuxt-kit`](./packages/nuxt-kit) | ![nuxt-kit version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fnuxt-kit%2Fpackage.json&label=) | Registers a module's pages as Nuxt routes under its base URL |
| [`@dnpm-dip/theme`](./packages/theme) | ![theme version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Ftheme%2Fpackage.json&label=) | Tailwind v4 / vuecs theme: brand tokens, fonts and chrome styles |
| [`@dnpm-dip/admin`](./packages/admin) | ![admin version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fadmin%2Fpackage.json&label=) | Admin module: Authup administration and the peer connection report |
| [`@dnpm-dip/mtb`](./packages/mtb) | ![mtb version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fmtb%2Fpackage.json&label=) | Molecular Tumor Board (MTB) module |
| [`@dnpm-dip/rd`](./packages/rd) | ![rd version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Frd%2Fpackage.json&label=) | Rare Diseases (RD) module |
| [`@dnpm-dip/portal`](./packages/portal) | ![portal version](https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fportal%2Fpackage.json&label=) | The Nuxt 4 application that ships as the Docker image |

`kit`, `http-kit`, `vue`, `nuxt-kit` and `theme` are published to npm; `admin`, `mtb`, `rd` and `portal` are private
and only ship inside the Docker image.

## Usage

### Production

**Prerequisites**

- **Docker** v24+ on the host machine

**Run**

```shell
docker run -d -p 3000:3000 \
    --restart=always \
    ghcr.io/dnpm-dip/portal:latest
```

The container listens on port `3000`.

### Configuration

The portal is configured at runtime via environment variables (pass them with `docker run -e ...`):

| Variable | Default | Description |
|----------|---------|-------------|
| `NUXT_PUBLIC_API_URL` | `https://dnpm-dip.net/api/` | REST API base URL |
| `NUXT_PUBLIC_AUTHUP_URL` | `https://dnpm-dip.net/auth/` | Authup base URL |
| `NUXT_PUBLIC_AUTHUP_CLIENT_ID` | `admin-console` | OAuth2 client used for the login (authorization-code) flow |
| `NUXT_PUBLIC_AUTHUP_REALM_ID` | `master` | Realm (UUID or name) that owns the OAuth2 client |
| `NUXT_PUBLIC_ACCOUNT_URL` | `<NUXT_PUBLIC_AUTHUP_URL>/console/account` | Account console (self-service) base URL |
| `NUXT_PUBLIC_COOKIE_DOMAIN` | — | Cookie domain for the auth session |

During server-side rendering the portal calls the API through the private `NUXT_API_URL` when it is set, and
falls back to `NUXT_PUBLIC_API_URL` otherwise. Set it when the container reaches the API over an internal
address that browsers cannot use.

### Authentication

The portal signs in with the **OAuth2 Authorization Code flow (PKCE)**; credentials are
never entered in the portal UI. DNPM:DIP runs a single (master) realm, so the login page
shows a single sign-in action rather than a realm picker; the portal builds an authorize URL
and redirects to Authup's `/authorize` endpoint, where the login form and the configured
identity providers live. Authup redirects back to `<portal-origin>/login/callback`, and the
`@authup/client-web-nuxt` routing interceptor exchanges the authorization code for a session.

The OAuth client is configurable via `NUXT_PUBLIC_AUTHUP_CLIENT_ID` (default: `admin-console`,
an Authup built-in system client; Authup ≤ `1.0.0-beta.58` instead shipped a shared `web`
client). A custom client **must** allow both `<portal-origin>/login/callback` and
`<portal-origin>/login/callback?redirect=*`. The second pattern carries the post-login
destination when signing in from a protected page. Deployments that registered only the
exact callback URI must add this pattern when upgrading, or deep-link sign-ins are rejected.

A name-identified client (such as the built-in `admin-console`) exists in every realm, so the
authorize request carries a realm hint (`NUXT_PUBLIC_AUTHUP_REALM_ID`, default: `master`, the
single DNPM:DIP realm, as a realm UUID or name). Otherwise Authup responds with _"A realm is
required to resolve a client by name."_

The portal uses Authup `1.0.0-beta.74` and namespaces its session cookies with `dnpm_`,
so a deployment sharing an origin with Authup's hosted consoles keeps the application
and IdP sessions separate. Navigation follows Authup's refreshed authorization verdicts through `permissionRevision`.

**Permissions** are checked by bare name (`mtb_query_submit`, `rd_validation_report_read`,
`connection_report_read`, …). A check accepts the global permission definition, or else the one owned by the
signed-in user's realm, so deployments that still hold these permissions as master-realm rows keep working.

### Account & self-service

The portal has no settings area. Profile, password, authenticators, sessions and connected
applications are managed in Authup's **account console**, served by server-core on the IdP
origin (Authup ≥ `1.0.0-beta.59`). The header's account icon (visible while signed in) links
straight to it, and is the only entry point: the sidebar carries no account entry, so the one
link that leaves for the IdP origin sits in one place. Point `NUXT_PUBLIC_ACCOUNT_URL` elsewhere
if the console is not reachable under `<NUXT_PUBLIC_AUTHUP_URL>/console/account`; with neither that nor
`NUXT_PUBLIC_AUTHUP_URL` configured, the icon is hidden rather than pointing nowhere.

The link carries the portal origin as `?ref=…` so the account console can render a back link.
Authup validates it against the trusted app origins, which the portal origin already has to be
part of for the login callback. The realm's built-in `account-console` client must also not be
denied by an access policy, or the console answers with _access denied_ instead of signing the
visitor in.

It also carries `&realmId=…` (`NUXT_PUBLIC_AUTHUP_REALM_ID`, the same realm the login flow uses).
The two origins hold independent sessions and the portal's outlives the IdP's (its token was
minted earlier and is held client-side), so the icon keeps rendering after the Authup session is
gone. The console applies the hint only when it sees an unauthenticated visitor, and then starts
the authorization-code flow against that realm instead of presenting a realm chooser.

### Development

To start the portal together with its modules (admin, mtb, rd), run these steps in order.

**Prerequisites**

- **Node.js** v26+ on the host machine

**Download**

```shell
git clone https://github.com/dnpm-dip/portal
cd portal
```

**Install**

Installs all dependencies and links the workspace packages.

```shell
npm install
```

**Build**

Creates an initial build of all packages, in dependency order (Nx).

```shell
npm run build
```

**Run**

Starts the portal in development mode with hot module replacement (HMR).

```shell
npm run dev
```

**Test and lint**

```shell
npm run test                              # all packages
npm run test --workspace=packages/mtb     # one package
npm run lint
```

The development server builds the portal and its modules from `src`. `kit`, `http-kit`, `vue` and `nuxt-kit` are
aliased to their sources too, so a change there shows up without rebuilding the package.

## Credits

If you have any questions, feel free to contact the author & creator Peter Placzek of the project.
The project is being developed as part of the author's master's thesis.

## License

Made with 💚

Published under [MIT License](./LICENSE).
