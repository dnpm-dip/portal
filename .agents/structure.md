# Project Structure

The project is a monorepo using TypeScript, ESM modules, and npm workspaces.
It is built on Nuxt 4 (Vue 3) with a modular architecture where domain-specific features are encapsulated as separate packages.

## Applications

| Name                                    | Type        | Description                                                    |
|-----------------------------------------|-------------|----------------------------------------------------------------|
| [portal](../packages/portal)            | Nuxt App    | Main web application — routes, layouts, plugins, and assets.   |

## Packages & Libraries

| Name                                    | Type        | Description                                                    |
|-----------------------------------------|-------------|----------------------------------------------------------------|
| [core](../packages/core)                | Library     | Shared components, composables, domain models, services, stores, and utilities. |
| [kit](../packages/kit)                  | Library     | Utilities for registering feature modules into the portal.     |
| [admin](../packages/admin)              | Module      | Admin functionality (auto-installed as Nuxt module).           |
| [mtb](../packages/mtb)                  | Module      | Molecular Tumor Board module (auto-installed as Nuxt module).  |
| [rd](../packages/rd)                    | Module      | Rare Diseases module (auto-installed as Nuxt module).          |

## Package Dependency Layers

Changes to a lower-layer package affect all packages above it. Build order follows these layers.
Internal `@dnpm-dip/*` dependencies are declared in each package's `package.json` — always consult those for the authoritative dependency graph.

```
Foundation (no internal deps):
  kit

Layer 1:
  core → kit

Feature Modules:
  admin → core, kit
  mtb   → core, kit
  rd    → core, kit

Application:
  portal → core, kit, admin, mtb, rd
```

## Portal Structure

```
packages/portal/
├── app.vue              — Root component
├── nuxt.config.ts       — Nuxt configuration
├── pages/               — Route pages (index, login, logout, settings)
├── components/          — Layout components (header, footer, sidebar)
├── stores/              — Pinia stores (modules store)
├── plugins/             — Nuxt plugins (bootstrap, chart.js, module registration)
├── layouts/             — Layout wrappers
├── middleware/           — Route middleware
├── assets/css/          — Stylesheets (layout, forms, pagination, etc.)
└── public/              — Static files
```

## Core Package Structure

```
packages/core/src/
├── components/          — Reusable Vue components
├── composables/         — Vue 3 composition functions
├── domains/             — Domain models (patient, query, site, coding, etc.)
├── services/            — API services (HTTP client via Authup)
├── stores/              — Pinia stores (query-filter, query-session)
├── utils/               — Utility functions
├── types.ts             — Type definitions
├── constants.ts         — Constants
└── index.ts             — Main export
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

- **Domain logic & shared components** → `packages/core`
- **Module registration utilities** → `packages/kit`
- **Feature-specific UI** → `packages/admin`, `packages/mtb`, `packages/rd`
- **App shell & routing** → `packages/portal`
