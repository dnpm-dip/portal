# Project Structure

The project is a monorepo using TypeScript, ESM modules, and npm workspaces.
It is built on Nuxt 4 (Vue 3) with a modular architecture where domain-specific features are encapsulated as separate packages.

## Applications

| Name                                    | Type        | Description                                                    |
|-----------------------------------------|-------------|------------------------------------------------------------------|
| [portal](../packages/portal)            | Nuxt App    | Main web application — routes, layouts, plugins, and assets.   |

## Packages & Libraries

| Name                                        | Type        | Description                                                    |
|----------------------------------------------|-------------|------------------------------------------------------------------|
| [kit](../packages/kit)                      | Library     | Framework-free utilities (no Vue, no Nuxt) shared by every other package. |
| [http-kit](../packages/http-kit)            | Library     | HTTP client, domain models and `I*API` interfaces for the DNPM:DIP API; ships a `./testing` fake client. |
| [vue](../packages/vue)                      | Library     | Vue components, composables, stores, services and DI; ships a `./testing` mount harness. |
| [nuxt-kit](../packages/nuxt-kit)            | Library     | Utilities for registering feature modules into the portal (Nuxt module registration). |
| [theme](../packages/theme)                  | Library     | Tailwind v4 / vuecs theme — design tokens, chrome styles, Bootstrap-compat shims. |
| [admin](../packages/admin)                  | Module      | Admin functionality (auto-installed as Nuxt module).           |
| [mtb](../packages/mtb)                      | Module      | Molecular Tumor Board module (auto-installed as Nuxt module).  |
| [rd](../packages/rd)                        | Module      | Rare Diseases module (auto-installed as Nuxt module).          |

## Package Dependency Layers

Changes to a lower-layer package affect all packages above it. Build order follows these layers.
Internal `@dnpm-dip/*` dependencies are declared in each package's `package.json` — always consult those for the authoritative dependency graph.

```
Foundation (no internal deps):
  kit
  theme
  nuxt-kit

Layer 1:
  http-kit → kit

Layer 2:
  vue → kit, http-kit

Feature Modules:
  admin → kit, http-kit, vue, nuxt-kit
  mtb   → kit, http-kit, vue, nuxt-kit
  rd    → kit, http-kit, vue, nuxt-kit

Application:
  portal → kit, http-kit, vue, nuxt-kit, theme, admin, mtb, rd
```

## Portal Structure

```
packages/portal/
├── app.vue              — Root component
├── nuxt.config.ts       — Nuxt configuration
├── pages/               — Route pages (index, login, logout)
├── components/          — Layout components (header, footer, sidebar)
├── stores/              — Pinia stores (modules store)
├── plugins/             — Nuxt plugins (vuecs, ilingo, chart.js, module registration)
├── layouts/             — Layout wrappers
├── middleware/           — Route middleware
├── assets/css/          — Tailwind v4 entry (imports @dnpm-dip/theme + @source scopes)
└── public/              — Static files
```

## `http-kit` Package Structure

Framework-free — no Vue, Pinia, or `@vuecs/*` import may appear here (see
[conventions.md](conventions.md#package-boundaries)).

```
packages/http-kit/src/
├── client/               — HTTPClient (wraps hapic), errors, module helpers
├── domains/              — Domain models + I*API interfaces (patient, query, site,
│                            coding, codesystem, valueset, prepared-query, ...)
├── resource/              — Collection/record response-shape helpers
├── testing/               — createFakeClient, fakeResponse, matchRoute (`./testing` export)
├── constants.ts
└── index.ts              — Main export
```

## `vue` Package Structure

```
packages/vue/src/
├── components/            — Reusable Vue components (domain-entity renderers + utility components)
├── composables/           — Vue 3 composition functions (e.g. toast)
├── core/                  — HTTP client DI (inject/provide), error handling, layout, resource helpers
├── services/               — Query event bus and similar app services
├── stores/                — Pinia stores (query-filter, query-session)
├── testing/                — mountComponent mount harness (`./testing` export)
├── utils/                  — Utility functions
├── install.ts             — Nuxt/Vue plugin install()
├── types.ts                — Type definitions
├── constants.ts            — Constants
└── index.ts                — Main export
```

## Feature Module Structure

Each feature module (admin, mtb, rd) follows a similar pattern:

```
packages/{module}/
├── src/
│   ├── runtime/
│   │   ├── components/  — Module-specific Vue components
│   │   ├── pages/       — Module-specific route pages
│   │   └── ...
│   └── module.ts        — Nuxt module entry point (auto-installed)
├── package.json
└── tsconfig.json
```

## Separation of Concerns

- **Framework-free shared utilities** → `packages/kit`
- **HTTP client & domain models** → `packages/http-kit`
- **Shared Vue components, stores & composables** → `packages/vue`
- **Nuxt module registration utilities** → `packages/nuxt-kit`
- **Design tokens, theme & chrome CSS** → `packages/theme`
- **Feature-specific UI** → `packages/admin`, `packages/mtb`, `packages/rd`
- **App shell & routing** → `packages/portal`
