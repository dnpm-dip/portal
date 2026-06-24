# Architecture

## Overview

The DNPM:DIP Portal follows a modular Nuxt 4 architecture where the main application (`portal`) acts as a shell that loads domain-specific feature modules (`admin`, `mtb`, `rd`) at build time. Shared logic lives in `core` and `kit`; the Tailwind/vuecs theme lives in `theme`.

## Layered Architecture

```
┌─────────────────────────────────────────────┐
│  Portal (Nuxt App Shell)                    │
│  Routes, layouts, plugins, middleware        │
├─────────────┬─────────────┬─────────────────┤
│  admin      │  mtb        │  rd             │
│  (module)   │  (module)   │  (module)       │
├─────────────┴─────────────┴─────────────────┤
│  core (shared library)                       │
│  Components, composables, domains, services  │
├──────────────────────┬───────────────────────┤
│  kit (registration)  │  theme (Tailwind/vuecs)│
└──────────────────────┴───────────────────────┘
```

### 1. Portal — App Shell

- Nuxt 4 application providing the overall page structure
- Registers feature modules via plugins (`packages/portal/plugins/`)
- Handles authentication via Authup integration
- Provides global layouts, navigation (header, sidebar, footer)
- Manages runtime configuration (API URL, Auth URL, Cookie domain)

### 2. Feature Modules — Domain-Specific UI

Each module (`admin`, `mtb`, `rd`) is a Nuxt module that auto-installs into the portal:
- Registers its own pages and components at runtime
- Uses the `kit` package to register navigation items and routes
- Depends on `core` for shared components, composables, and API services

### 3. Core — Shared Library

The heart of the codebase. Contains:
- **Components**: Reusable Vue components for rendering domain entities
- **Composables**: Vue 3 composition API hooks for common logic
- **Domains**: TypeScript types and interfaces for medical domain models (patients, queries, sites, coding systems, etc.)
- **Services**: HTTP client wrappers for backend API communication
- **Stores**: Pinia stores for state management (query filters, query sessions)
- **Utils**: Shared utility functions

### 4. Kit — Module Registration

Provides helper functions and types for feature modules to register themselves into the portal (navigation items, routes, module metadata).

## State Management

- **Pinia** is used for global state management
- Key stores: query-filter store, query-session store, modules store
- Stores are defined in `core` and `portal` packages

## Authentication

- **Authup** framework handles authentication and session management
- OAuth/OIDC support
- HTTP client (`hapic`) is configured with Authup tokens

## API Communication

- HTTP client via `hapic` library
- REST API endpoints at configurable base URL
- Runtime configuration via environment variables:
  - `API_URL` (default: `https://dnpm-dip.net/api/`)
  - `AUTHUP_URL` (default: `https://dnpm-dip.net/auth/`)
  - `COOKIE_DOMAIN`

## UI Framework

- **Tailwind CSS v4** for styling, themed through `@dnpm-dip/theme` (`packages/theme`):
  composes `@authup/client-web-kit-theme` (tailwindcss + `@vuecs/design` tokens +
  `@vuecs/theme-tailwind`), DNPM chrome/brand tokens, a Bootstrap-compat
  `@layer components` shim block, and the migrated chrome stylesheets.
  The portal consumes it via `packages/portal/assets/css/tailwind.css`,
  which also declares the `@source` scan scopes for the sibling packages.
- **vuecs** (`@vuecs/*`) component suite — forms, table, pagination, overlays
  (modal/toast), navigation (v4 registry model), placeholder, timeago, elements.
  Installed and themed in `packages/portal/plugins/vuecs.ts` (`app.use(vuecs, ...)`
  first, per-package installs after).
- **Light/dark color mode** via `@vuecs/nuxt` (`useColorMode`, `.dark` class on
  `<html>`); chrome colors are `--dnpm-*` tokens that flip with the mode.
- **Icons** via `<VCIcon>` + Iconify (`fa6-solid` / `fa6-brands` collections,
  registered with `addCollection` in the vuecs plugin).
- **Forms & validation**: validup (`@validup/vue` + `@validup/zod`) with
  `@ilingo/vue` 6 translations (`packages/portal/plugins/ilingo.ts`).
- **Chart.js** for data visualization

## Build & Deployment

- **Nx** orchestrates monorepo builds with dependency-ordered execution and caching
- **tsdown** builds library packages (`core`, `kit`, `theme`)
- **Nuxt** builds the portal application
- **Docker** (Node 22 Alpine) for production deployment
- Container runs on port 3000
