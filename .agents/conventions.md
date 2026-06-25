# Conventions

## Tooling

| Tool             | Purpose                                           |
|------------------|---------------------------------------------------|
| Nx               | Monorepo task runner (dependency-ordered builds)   |
| tsdown           | Library package bundling (core, kit)               |
| Nuxt 4           | Portal application framework                       |
| Vitest           | Test runner                                        |
| ESLint v10       | Linting (`@tada5hi/eslint-config`, flat config)    |
| monoship         | Publishing workspace packages                      |
| Husky            | Pre-commit hooks via lint-staged                   |
| commitlint       | Commit message convention enforcement              |

## Workflow

- After making changes, **always build** the affected package and **run ESLint** on all changed files.
- Build: `npm run build --workspace=packages/<name>` (from repo root)
- Lint: `npx eslint --fix path/to/changed/file1.ts path/to/changed/file2.ts`
- Fix any build or lint errors before considering a task complete.

## Commit Messages

This project uses conventional commits enforced by commitlint (`@tada5hi/commitlint-config`).

Format: `type(scope): description`

Common types:
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code refactoring
- `docs` — Documentation changes
- `chore` — Maintenance tasks
- `test` — Adding or updating tests

Scopes typically match package names: `core`, `portal`, `mtb`, `rd`, `admin`, `kit`, `deps`.

## Code Style

- **TypeScript** with strict typing and **ESM** module syntax throughout
- **Vue 3** Single File Components (SFC) with `<script setup lang="ts">`
- Follow the existing `@tada5hi/eslint-config` rules
- No explanatory comments unless explicitly requested — rely on existing patterns and clear naming

## File Organization

- Exported **types** (interfaces, type aliases) should live in dedicated `types.ts` files
- Use barrel `index.ts` files for re-exports
- Vue components use PascalCase filenames
- Composables use `use` prefix (e.g., `useQueryFilter`)

## Vue & Nuxt Conventions

- Use Vue 3 Composition API (`<script setup>`)
- Use Pinia for state management
- Feature modules register themselves via `kit` helpers
- Pages are auto-routed by Nuxt file-based routing
- Plugins in `packages/portal/plugins/` handle global setup
- **Always use explicit component imports.** Import `@vuecs/*` components where you use them
  (`import { VCButton } from '@vuecs/button'`, `VCAlert`/`VCBadge`/`VCCard*` from `@vuecs/elements`).
  In an Options-API SFC (`defineComponent` / `defineNuxtComponent`, which is what this codebase
  currently uses) also register them in `components: { ... }`; in a `<script setup>` SFC the import
  alone registers the component, so no `components` entry is needed. Either way, do **not** rely on
  the global vuecs plugin registration, even though it exists. One deliberate exception: the **`VCTable` family**
  (`VCTable`/`VCTableEmpty`/`VCTableLoading`) is left global — importing the now-generic `VCTable`
  (@vuecs/table 1.3.0) trips a `defineNuxtComponent` overload under `nuxt typecheck` unless every
  table's `:data`/`:columns` are typed end-to-end; adopting typed table slots is a separate follow-up.
- Prefer a `<VCIcon>` in the default slot over an `icon-left` / `iconLeft` prop on `VCButton` / `VCAlert`.

## Best Practices

- Use **ESM** and modern TypeScript/JavaScript
- Maintain consistency with existing naming and architectural conventions
- Before adding new code, study surrounding patterns and naming conventions
- Respect separation of concerns: shared logic → `core`, module registration → `kit`, domain UI → feature modules, app shell → `portal`
- Prefer editing existing files over creating new ones
- Keep changes minimal and focused on the task at hand

## UI Design Language

Established during the Tailwind v4 migration. When building or restyling a view, reuse these
patterns instead of inventing new ones — and when refactoring an old view, migrate it to them:

- **Page header**: gradient icon tile + title + muted subline, secondary action right-aligned:
  ```html
  <header class="mb-4 flex items-center gap-4">
      <span class="flex size-12 shrink-0 items-center justify-center rounded-xl
                   bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary shadow-md">
          <VCIcon name="fa6-solid:..." />
      </span>
      <div class="min-w-0">
          <h1 class="mb-0 text-2xl font-bold tracking-tight">Titel</h1>
          <p class="mb-0 text-sm text-fg-muted">Untertitel / Kontext</p>
      </div>
      <VCButton tag="nuxt-link" :to="..." size="sm" color="neutral" variant="soft" class="ms-auto">…</VCButton>
  </header>
  ```
- **Section headings**: `.section-label` (theme class — small-caps muted, optional leading `<VCIcon>`),
  on `h5`/`h6`/`span` hosts. No `<hr>` separators between sections; use margins.
- **Cards/panels**: `.entity-card` (theme-owned chrome: 12px radius, soft shadow). Never add inline
  `style="max-width: ..."`; lay out card groups with `grid gap-3 md:grid-cols-2 xl:grid-cols-3`.
- **Facts (label-over-value)**: `DFact` from `@dnpm-dip/core` (`label`, optional `icon`, value via slot).
  Use for entity metadata rows and fact grids instead of `<strong>Label</strong> value` lines.
- **Chips/pills**: `rounded-full border border-border bg-bg px-2 py-0.5 text-xs` for code/term chips;
  status pills use tinted surfaces (`bg-success-500/10 text-success-600`, `bg-error-500/10 text-error-600`).
- **Buttons**: `<VCButton>` (@vuecs/button) — `color="primary"` for THE primary action, `color="neutral"`
  `variant="soft"` for secondary, `color="error"` destructive; `size="xs|sm|md|lg"`; `variant="outline"`
  for outline. One primary per view. For a button-styled router link use `<VCButton tag="nuxt-link" :to>`.
  Long forms end in a sticky right-aligned action bar (`sticky bottom-0 ... border-t bg-bg/85 backdrop-blur`).
- **Alerts / badges / cards**: `<VCAlert :color :variant="soft" [size]>`, `<VCBadge>`, and the
  `<VCCard>`/`<VCCardHeader>`/`<VCCardBody>` family (@vuecs/elements) — not Bootstrap-shaped `.alert` /
  `.badge` / `.card` classes. The Bootstrap-compat shim layer (`.btn` / `.row` / `.col*` / `.card*` /
  `.alert*` / `.nav*` / `.modal-*` …) was **retired**; use `<VC*>` components and Tailwind utilities
  (12-col grids → `flex`/`grid` utilities). Only the `.bg-*` DTags aliases and `.nav*` tab-pill chrome
  (styles/domain.css) survive.
- **Colors**: semantic tokens only (`text-fg-muted`, `bg-bg-muted`, `border-border`, `primary-*`,
  `--dnpm-brand-*`) — never hard-coded hex; everything must work in light and dark mode.
- Content (titles, descriptions, copy) is crafted in Vue templates (slots), not stored in
  registration/config objects.

## Keep MTB and RD Modules in Sync

The `mtb` and `rd` feature modules expose parallel UI patterns (filters, query pages, summary views). When changing one, check the other for the equivalent component and mirror the change so the two modules stay consistent in behavior and appearance.

- Naming parallels: `MQuery*` (mtb) ↔ `RQuery*` (rd), both consuming shared components from `core` (e.g. `DQueryFilterBox`).
- Before finishing a task touching one module, grep the other for the matching component (`MQueryDiagnosisFilter` → `RQueryDiagnosisFilter`, etc.) and apply equivalent changes.
- If a pattern only makes sense in one module, document why in a comment or commit message.
