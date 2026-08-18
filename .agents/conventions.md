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

## Dependencies

`npm install` runs **without `--force`** and without `--legacy-peer-deps`. If it
ERESOLVEs, fix the actual conflict — both flags produce a tree that disagrees
with the manifests. Historically `--force` was required here; it papered over a
tree in which `pinia`, `validup`, `@validup/vue` and `@authup/client-web-kit`
were each installed as **five nested per-workspace copies** instead of one
hoisted copy. Those packages hand state through Vue's `provide`/`inject`, so a
duplicated copy silently splits the singleton (two Pinia instances, two authup
stores). After a dependency bump, verify the tree is flat:

```bash
find packages/*/node_modules -maxdepth 2 -type d \
    \( -name pinia -o -name validup -o -name vue -o -name client-web-kit \)
```

Anything printed is a split singleton. An incremental `npm install` will not
re-hoist an already-nested layout — that needs
`rm -rf node_modules packages/*/node_modules package-lock.json && npm install`.
Never hand-resolve a `package-lock.json` conflict; regenerate it.

The `@authup/*` packages pin their peers tightly, so bumping them drags the
whole client stack (`@vuecs/*`, `validup`, `@ilingo/*`, `pinia`, `vue`,
`tailwindcss`) along. Read the target release's peer ranges before bumping:

```bash
npm view @authup/client-web-kit@<version> peerDependencies --json
```

### The `vue` override must never be pinned to a literal

Root `package.json` keeps a single-version override for `vue`, written as a
**reference to the root devDependency**, never as a hard-coded version:

```jsonc
"overrides": { "vue": "$vue" },
"devDependencies": { "vue": "^3.5.41" }
```

A literal (`"vue": "3.5.40"`) desyncs the moment dependabot bumps `vue` in the
workspace manifests — it only touches `dependencies`, never `overrides`. The
override then forces `vue`/`@vue/runtime-*` to the old patch while
`@vue/reactivity` hoists to the new one, and npm nests **three** copies of
`@vue/reactivity`. That breaks types, not just runtime: `@vue/runtime-dom`
writes its `RefUnwrapBailTypes` DOM bail-out into *its own* nested copy, while
`ref()`'s `UnwrapRef` reads the copy under `@vue/runtime-core`. Without the
bail-out, `UnwrapRef<HTMLCanvasElement>` deep-maps the DOM interface into an
anonymous structural type, and every `ref<HTMLElement>().value` stops being
assignable to `Element` — surfacing as an inscrutable multi-screen TS2345 in an
unrelated component. Verify after any `vue` bump:

```bash
find node_modules -name reactivity -type d -path "*@vue*"
```

More than one line printed means the override is out of sync.

## Authup API Shapes

Entity **record** endpoints return an envelope, not the bare record — every
`getOne` / `create` / `update` / `delete` on an `@authup/core-http-kit` entity
API resolves to `{ data, meta }`, mirroring the collection endpoints:

```ts
const { data } = await authup.user.getOne(id, { fields: ['+email'] });
entity.value = data;
```

Protocol surfaces (token, introspect, authorize, logout, userinfo) stay flat.

## The Issue Model Lives in `@ebec/core`

Since validup 2.x, the issue vocabulary (`Issue`, `IssueItem`, `IssueGroup`,
`IssueCode`, `defineIssueItem`, `defineIssueGroup`) is owned by `@ebec/core`,
not by `validup`. A hand-rolled validator that raises its own issue imports the
factory from there and keeps `ValidupError` from `validup`:

```ts
import { defineIssueItem } from '@ebec/core';
import { Container, ValidupError } from 'validup';

throw new ValidupError([
    defineIssueItem({ path: [], message: '…' }),
]);
```

`validup` still owns `Container`, `Validator`, `ValidupError`, `OptionalValue`
and adds `createValidupError(received, code, message, …)` as sugar for the
single-issue case — that one needs a `code`, so it only saves the import when
`IssueCode` is already in scope. Any package that constructs issues therefore
declares `@ebec/core` itself (`mtb`, `rd`); consuming an issue off a caught
`ValidupError` needs no new dependency.

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
      <VCButton :as="NuxtLink" :to="..." size="sm" color="neutral" variant="soft" class="ms-auto">…</VCButton>
  </header>
  ```
- **Section headings**: `.section-label` (theme class — small-caps muted, optional leading `<VCIcon>`),
  on `h5`/`h6`/`span` hosts. No `<hr>` separators between sections; use margins.
- **Cards/panels**: `.entity-card` (theme-owned chrome: `--vc-radius-md` ≈ 6px radius, soft shadow). Never add inline
  `style="max-width: ..."`; lay out card groups with `grid gap-3 md:grid-cols-2 xl:grid-cols-3`.
- **Facts (label-over-value)**: `DFact` from `@dnpm-dip/core` (`label`, optional `icon`, value via slot).
  Use for entity metadata rows and fact grids instead of `<strong>Label</strong> value` lines.
- **Chips/pills**: `rounded-full border border-border bg-bg px-2 py-0.5 text-xs` for code/term chips;
  status pills use tinted surfaces (`bg-success-500/10 text-success-600`, `bg-error-500/10 text-error-600`).
- **Buttons**: `<VCButton>` (@vuecs/button) — `color="primary"` for THE primary action, `color="neutral"`
  `variant="soft"` for secondary, `color="error"` destructive; `size="xs|sm|md|lg"`; `variant="outline"`
  for outline. One primary per view. For a button-styled router link, render VCButton **as** the
  NuxtLink **component**, not the string tag: resolve it in setup (`const NuxtLink =
  resolveComponent('NuxtLink')`, return it) and use `<VCButton :as="NuxtLink" :to="...">`. Do **not**
  use `tag="nuxt-link"` (a string) — VCButton does `h(tag)`, so the string renders a dead `<nuxt-link>`
  custom element that never navigates; `tag` is a deprecated alias for `as` anyway.
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
