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

## Best Practices

- Use **ESM** and modern TypeScript/JavaScript
- Maintain consistency with existing naming and architectural conventions
- Before adding new code, study surrounding patterns and naming conventions
- Respect separation of concerns: shared logic → `core`, module registration → `kit`, domain UI → feature modules, app shell → `portal`
- Prefer editing existing files over creating new ones
- Keep changes minimal and focused on the task at hand

## Keep MTB and RD Modules in Sync

The `mtb` and `rd` feature modules expose parallel UI patterns (filters, query pages, summary views). When changing one, check the other for the equivalent component and mirror the change so the two modules stay consistent in behavior and appearance.

- Naming parallels: `MQuery*` (mtb) ↔ `RQuery*` (rd), both consuming shared components from `core` (e.g. `DQueryFilterBox`).
- Before finishing a task touching one module, grep the other for the matching component (`MQueryDiagnosisFilter` → `RQueryDiagnosisFilter`, etc.) and apply equivalent changes.
- If a pattern only makes sense in one module, document why in a comment or commit message.
