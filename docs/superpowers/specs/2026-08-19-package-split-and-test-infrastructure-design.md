# Package Split & Test Infrastructure

- **Date:** 2026-08-19
- **Status:** Approved (design)
- **Branch:** `refactor/split-packages-and-test-infrastructure`

## Problem

`@dnpm-dip/core` is a single package holding the HTTP client, the domain
models, every shared Vue component, the Pinia stores and the composables. Two
consequences:

1. **Nothing is tested.** The monorepo contains zero `.spec.ts` files. The
   `test` script (`nx run-many -t test`) matches no target and passes silently,
   and `.agents/testing.md` documents a Vitest setup that does not exist.
2. **The client cannot be substituted.** `HTTPClient` is a concrete class with
   no contract, so a caller typed against it cannot accept a double without a
   cast, and there is no double to accept.

The reference implementation is PrivateAIM/hub (`packages/core-http-kit`,
`packages/client-vue`), checked out locally at `/opt/projects/privateaim/hub`.

## Non-goals

- Booting Nuxt in tests. Specs mount components directly; the six
  `runtime/plugins/*.ts` files (the only code importing `#app` / `#imports`)
  stay out of test scope.
- DOM snapshot assertions. Specs assert behaviour only — see "Testing strategy".
- Preserving `@dnpm-dip/core` on npm. It is deliberately removed.

## Target package layout

```
@dnpm-dip/kit        general utils, framework-free       -> (no internal deps)
@dnpm-dip/nuxt-kit   Nuxt page registration              -> (no internal deps)
@dnpm-dip/theme      unchanged                           -> (no internal deps)
@dnpm-dip/http-kit   domains + interfaces + client       -> kit
@dnpm-dip/vue        components/stores/composables/DI    -> kit, http-kit
@dnpm-dip/admin
@dnpm-dip/mtb                                            -> kit, http-kit, vue, nuxt-kit
@dnpm-dip/rd
@dnpm-dip/portal                                         -> all of the above
```

`@dnpm-dip/core` is **deleted**. `@dnpm-dip/nuxt-kit` is today's
`@dnpm-dip/kit` renamed verbatim; the `kit` name is reused for framework-free
utilities, mirroring `@authup/kit`.

Build order follows the dependency layers; Nx derives it from the manifests.

## Content map

The partition rule: **a file goes to `http-kit` or `kit` if and only if it has
no Vue-family import** (`vue`, `pinia`, `@vuecs/*`, `@authup/client-web-kit`,
`vue-chartjs`, `chart.js`, `@validup/*`, `@ilingo/*`, `zod`).

### `@dnpm-dip/kit`

From `core/src/utils/`: `clone`, `debounce`, `has-own-property`, `is-object`,
`template`, `url-query`, `color/*`. Plus the `ObjectLiteral` type from
`core/src/types.ts`.

Excludes `utils/ref.ts` (imports `Ref` from `vue`).

### `@dnpm-dip/http-kit`

- `core/src/domains/**` — every domain type and API class.
- `core/src/core/http-client/{module,types,error,helper,constants}.ts`
  -> `src/client/`.
- `core/src/core/resource/{collection,record}/utils.ts` and the non-Vue half of
  `core/resource/constants.ts` (`ResourceCollectionSortDirection`)
  -> `src/resource/`.
- `LogicalOperator` from `core/src/constants.ts` (a domain concept).
- **New:** `src/testing/` exported at the `./testing` subpath.

### `@dnpm-dip/vue`

Everything else formerly in `core`:

- `components/**`, `composables/**`, `stores/**`, `services/**`
- `core/{error,layout,inject,provide,utils/slot}`
- `core/resource/{collection,record}/{module,types}.ts` and `ResourceSlotName`
- `core/http-client/{di,install,setup}.ts`
- `utils/ref.ts`, `install.ts`
- `ModuleType` + `QueryFilterURLKey` from `constants.ts`; `InstallOptions`,
  `ModuleMeta`, `NavigationItemMeta` from `types.ts`
- **New:** `src/testing/` exported at the `./testing` subpath.

`services/query-event-bus` is Vue-free in isolation but exists solely to
coordinate the Pinia stores, and its `singleton.ts` uses `provide`/`inject`.
It lives in `vue`.

### Files that split

| File | Disposition |
| --- | --- |
| `domains/coding/utils.ts` | The function returning `FormOption` (`@vuecs/forms`) moves to `vue`; the remainder stays in `http-kit`. |
| `core/resource/constants.ts` | `ResourceCollectionSortDirection` -> `http-kit`; `ResourceSlotName` -> `vue`. |
| `core/src/constants.ts` | `LogicalOperator` -> `http-kit`; `ModuleType`, `QueryFilterURLKey` -> `vue`. |
| `core/src/types.ts` | `ObjectLiteral` -> `kit`; the rest -> `vue`. |
| `core/http-client/index.ts` | Barrel splits across `http-kit` and `vue`. |
| `core/resource/{collection,record}/types.ts` | `ResourceCollectionEventsType`, `ResourceCollectionLoadMeta` and `ResourceRecordEventsType` -> `http-kit/src/resource/types.ts`; the Vue-bound manager/slot types stay. Discovered during implementation, not in the original content map: `defineResourceCollectionEvents` and `defineResourceRecordEvents` move to `http-kit` and must return exactly these types. Duplicating them would drift, and importing them from `core` would invert the dependency direction. |

## Interfaces

### The load-bearing fix

`core/src/core/http-client/types.ts` currently reads:

```ts
export type HTTPClientOptions = RequestBaseOptions;
```

`RequestBaseOptions` carries no `transport` field, so no test can inject one.
It becomes:

```ts
export type HTTPClientOptions = ClientOptionsInput;
```

This single change is what makes a transport-level fake possible at all.

### Contracts

Each API class gains an interface declared beside it, and the client gains a
contract naming those interfaces rather than the concrete classes:

```ts
export interface IHTTPClient extends IClient {      // hapic's IClient
    readonly codeSystem : ICodeSystemAPI;
    readonly query      : IQueryAPI;
    readonly site       : ISiteAPI;
    readonly valueSet   : IValueSetAPI;
}

export class HTTPClient extends BaseClient implements IHTTPClient { /* … */ }
```

Members are typed as interfaces, not concrete classes, so the contract stays
purely structural — `BaseAPI`'s `protected client` cannot break assignability
when a `src` copy meets a `dist` copy of the same declaration.

The same shape applies to the feature-module clients: `IMTBAPIClient`,
`IRDHTTPClient`, `IAdminAPIClient`, each naming per-API interfaces.

**DI signatures move to the interface** — `injectHTTPClient(): IHTTPClient`,
`provideHTTPClient(client: IHTTPClient, app?)` — so a fake satisfies them
without a cast at the call site.

## `@dnpm-dip/http-kit/testing`

A port of hub's `core-http-kit/testing`, adapted to portal's wire shapes.

`FakeClient extends HTTPClient` and replaces **only the transport** with
hapic's `MemoryTransport`. Everything above the transport still runs for real:
hook dispatch, header merging, an attached authentication hook, request/response
transformation, decoding, retry. It remains a genuine subclass, so `isClient()`
and own-property sub-API lookup behave as in production.

```ts
const client = createFakeClient({
    handlers: {
        'GET /mtb/queries/:id': (req) => ({ id: req.params.id }),
        'GET /mtb/queries/:id/patient-matches': () => ({ entries: [], size: 0 }),
    },
});

client.requests;   // normalized: captured params, lower-cased headers, parsed body
```

Surface:

- `createFakeClient(options)` / `FakeClient`
- `fakeResponse(status, body)` — drives a non-2xx through the real hapic error
  pipeline instead of fabricating an error object.
- `matchRoute(method, url, handlers)` — `':param'` placeholders, `'*'`
  catch-all which always loses to a specific pattern, first-insertion-order wins
  among specific patterns, query string ignored.

### Divergences from hub (do not blind-copy)

1. **Collection shape.** Portal's wire format is
   `{ entries, size?, limit?, offset? }` (`domains/types.ts`), not hub's
   `{ data, meta }`. The default fallback handler returns
   `{ entries: [], size: 0 }`. This is the shape of `ResourceCollectionResponse<T>`
   and covers the majority of endpoints, but it is **not universal**: `SiteAPI`
   returns `SiteResponse = { local: Coding, others: Coding[] }`. The fallback is
   only for unmatched routes — every explicit handler fixture must match its
   method's declared return type, or the spec asserts the fake's echo instead of
   the API.
2. **Error payload.** Portal's is `{ issues: [{ severity, details }] }`
   (`HTTPClientErrorPayload`), not hub's `{ message }`. Error helpers and any
   `RESPONSE_ERROR` hook align to `issues`.
3. **`baseURL` must stay path-free** in fakes — `matchRoute` matches against
   the full pathname, so a `baseURL` carrying a path prevents every pattern
   from matching.

## `@dnpm-dip/vue/testing`

```ts
mountComponent(component, props, handlers, options) -> { wrapper, client, pinia }
```

Install order is load-bearing:

1. `pinia` — authup's store factory needs it, and there is no ambient injection
   context outside Nuxt.
2. `@vuecs/core` — first-install-wins theme manager.
3. `@authup/client-web-kit` — **before** the portal install, whose
   `setupBaseHTTPClient` calls `injectHTTPClientAuthenticationHook(app)`. Fed a
   fake from `@authup/core-http-kit/testing`, which beta.62 already ships.
4. `@dnpm-dip/vue`'s `install`, with the fake client passed **explicitly**.

Two mandatory details:

- `VCIcon` is stubbed by name. It renders through `@iconify/vue`, which resolves
  an unknown icon by fetching it from the iconify API; left live, every
  icon-rendering spec makes a real network request and happy-dom aborts it at
  teardown. Stubbing by name also intercepts the `VCIcon` that `@vuecs/button`
  imports directly, which a global `components` registration would not.
- `isServer: true`, which maps to the auth hook's `timer: !isServer`. Without
  it a real refresh timer is armed and leaks across specs.

Passing the client explicitly matters: every `install*()` early-returns on
`isHTTPClientUsable(app)` and `provide()` is first-wins, so pre-providing a fake
in the wrong order fails **silently**, with the real client winning.

`admin`, `mtb` and `rd` each wrap this in `test/utils/` to additionally provide
their own module client (`new MTBAPIClient(fakeClient)`).

## Testing strategy

- **Framework:** Vitest, `environment: 'happy-dom'`, `plugins: [vue()]`.
- **Layout:** `test/unit/**/*.spec.ts` per package, mirroring `src/`, with
  shared helpers in `test/utils/`.
- **Resolution:** each `test/vitest.config.ts` aliases `@dnpm-dip/*` to the
  sibling package's `src/`. Tests therefore need no prior build and cannot go
  stale against `dist` — a failure mode this repo has hit before.
- **Assertions:** behavioural only — emitted events, requests actually
  dispatched (via `client.requests`), rendered text, conditional branches. No
  DOM snapshots; the UI is restyled often enough that snapshots would be noise.
- **Coverage:** broad. Domain API classes (URL construction, query
  serialization, response unwrapping), `kit` utilities, resource meta
  stringification, the Pinia stores, and the significant components in `vue`,
  `mtb`, `rd` and `admin`.

New root devDependencies: **`@vue/test-utils`** and **`happy-dom`**.
`vitest@4.1.11` and `@vitejs/plugin-vue@6.0.8` are already installed.

## Release plumbing

`release-please-config.json` and `.release-please-manifest.json`:

- remove `packages/core` and the stale `packages/rare-diseases` entry
- add `packages/http-kit`, `packages/vue`, `packages/nuxt-kit`, and
  `packages/admin` (absent today)
- update the `linked-versions` group membership to match

Versioning and changelogs stay owned by release-please; no manifest versions
are hand-edited beyond adding and removing package entries.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| 121 tracked source files import `@dnpm-dip/core` and must be rewritten. | Mechanical, fanned out across agents, verified by build + `nuxt typecheck` + lint rather than by inspection. |
| Dependency churn corrupting the tree. | One `npm install` at the end, never incremental during dev. Then the flat-tree check from `.agents/conventions.md`: `pinia`, `validup`, `vue`, `client-web-kit` must not appear nested under `packages/*/node_modules`. |
| `@dnpm-dip/core` vanishes from npm. | Accepted and explicitly decided by the maintainer. |
| A split barrel silently drops an export. | The portal build and `nuxt typecheck` cover the app; each new package's `index.ts` is diffed against the old `core` barrel. |
| Icon bundle regressions. | `NuxtIconBundle`'s `scan.globInclude` in `packages/portal/nuxt.config.ts` lists packages by path and **fails silently**. It must be updated for `http-kit`, `vue` and `nuxt-kit`, and verified against the build log's `Nuxt Icon bundled N icons`. |

## Verification

Definition of done:

1. `npm run build` succeeds across all packages.
2. `npm run test` runs real suites in `kit`, `http-kit`, `vue`, `admin`, `mtb`,
   `rd` — and passes.
3. `npx nuxt typecheck` in `packages/portal` is clean.
4. `npm run lint` is clean.
5. `grep -r "@dnpm-dip/core" packages/` returns nothing.
6. The flat-tree check prints nothing.
7. `.agents/{structure,architecture,testing,conventions}.md` describe the new
   layout, and `.agents/testing.md` in particular describes a setup that now
   actually exists.
