# Testing

## Framework

- **Vitest** as the test runner
- Tests live in a `test/` directory within each package, with a package-local
  `test/vitest.config.ts`
- `packages/{kit,http-kit}/test/vitest.config.ts` run in the default Node
  environment; `packages/{vue,admin,mtb,rd}/test/vitest.config.ts` add
  `environment: 'happy-dom'` and the `@vitejs/plugin-vue` plugin, since those
  packages mount real Vue components

## Commands

```bash
# Run all tests across the monorepo
npm run test

# Run tests for a specific package
npm run test --workspace=packages/kit
npm run test --workspace=packages/http-kit
npm run test --workspace=packages/vue
npm run test --workspace=packages/mtb
npm run test --workspace=packages/rd
npm run test --workspace=packages/admin
```

## No Build Prerequisite (for `admin`, `mtb`, `rd`)

The three feature modules do **not** require the workspace to be built first.
Each one's `test/vitest.config.ts` aliases every `@dnpm-dip/*` import
straight to the sibling package's `src/`, e.g.
(`packages/mtb/test/vitest.config.ts`):

```ts
resolve: {
    alias: {
        '@dnpm-dip/vue/testing': path.resolve(__dirname, '../../vue/src/testing'),
        '@dnpm-dip/http-kit/testing': path.resolve(__dirname, '../../http-kit/src/testing'),
        '@dnpm-dip/vue': path.resolve(__dirname, '../../vue/src'),
        '@dnpm-dip/http-kit': path.resolve(__dirname, '../../http-kit/src'),
        '@dnpm-dip/kit': path.resolve(__dirname, '../../kit/src'),
    },
},
```

This removes the `npm run build` prerequisite for running these three
packages' tests and — more importantly — prevents a stale `dist/` from
masking a source change: without the alias, a test run could silently
exercise yesterday's build output.

**This does not extend to `kit`, `http-kit` and `vue` themselves** — their
own `test/vitest.config.ts` declare no such alias, so their tests resolve
`@dnpm-dip/*` imports through the normal npm-workspace symlink into the
dependency's `package.json` `exports`, i.e. its **built** `dist/`. `kit` has
no internal `@dnpm-dip/*` dependency, so this is moot for it; but `http-kit`
(which imports `@dnpm-dip/kit`) and `vue` (which imports both `@dnpm-dip/kit`
and `@dnpm-dip/http-kit`) do need their upstream dependencies built before
their own test suite can resolve those imports — verified by moving
`packages/kit/dist` aside and re-running `npm run test --workspace=packages/http-kit`,
which fails with `Failed to resolve entry for package "@dnpm-dip/kit"`.
`npm run build` (or at least building `kit` and `http-kit`) is therefore
still a real prerequisite for `http-kit`'s and `vue`'s own test runs.

**The alias keys must be ordered longest-first.** Vite/Vitest resolves alias
keys by matching prefixes in the order they are declared, and the first match
wins. `@dnpm-dip/vue/testing` and `@dnpm-dip/http-kit/testing` are themselves
prefixed by `@dnpm-dip/vue` and `@dnpm-dip/http-kit`, so the `/testing`
sub-path entries must come first in the object — otherwise an import of
`@dnpm-dip/vue/testing` would match the bare `@dnpm-dip/vue` alias first and
resolve to `.../vue/src/testing`'s *parent* incorrectly (or fail to resolve
the `/testing` export at all).

## Test File Conventions

- Test files use the `.spec.ts` extension
- Tests live under `test/unit/**/*.spec.ts`, mirroring the source structure
  (e.g. `test/unit/domains/site.spec.ts` mirrors `src/domains/site/`)
- Import from the package's public API (the `src/index.ts` barrel export),
  not deep-relative source paths
- **Assertions are behavioural only — no DOM snapshots.** Assert on emitted
  events, injected client calls, rendered text/attributes that matter to the
  behaviour under test, etc. Do not assert on a serialized DOM tree.

## `createFakeClient` (`@dnpm-dip/http-kit/testing`)

A fake `HTTPClient` for testing domain API calls without a network. Routes
are declared as a handler map keyed `'<METHOD> /<path>'`:

```ts
import { createFakeClient } from '@dnpm-dip/http-kit/testing';

const client = createFakeClient({
    handlers: {
        'GET /mtb/queries/:id': (request) => ({ id: request.params.id }),
        'POST /mtb/queries': () => ({ id: 'created' }),
        '*': () => ({ entries: [], size: 0 }), // catch-all fallback
    },
});
```

- A `:segment` in the path pattern captures into `request.params`.
- `'*'` is a catch-all, matched only when no specific pattern matches
  (specific patterns win regardless of key order).
- Every call the client makes is recorded on `client.requests` — assert on
  `client.requests[0]?.method`, `.url`, `.params`, `.body` — instead of
  re-asserting the handler's own return value.
- With no handlers at all, unmatched requests fall back to
  `{ entries: [], size: 0 }` (the default portal-collection shape).

Use `fakeResponse(status, body)` to make a handler return a real non-2xx
response and drive it through hapic's actual error pipeline (so error-path
code under test sees a real `hapic` error, e.g. `isClientError`):

```ts
import { createFakeClient, fakeResponse } from '@dnpm-dip/http-kit/testing';
import { isClientError } from 'hapic';

const client = createFakeClient({
    handlers: {
        'GET /mtb/sites': () => fakeResponse(500, { issues: [{ severity: 'error', details: 'boom' }] }),
    },
});

await expect(client.site.getItems('mtb')).rejects.toSatisfy(isClientError);
```

**Fixture rule: every handler fixture must match its method's declared
return type.** The fake client echoes back whatever the handler returns —
it does not validate it against the real API contract. A fixture invented
from prose (rather than read off the `I*API` method's return type in
`packages/http-kit/src/domains/`) makes the spec assert the fake, not the
API. `SiteAPI` is the notable exception to the usual `{ entries, size }`
portal-collection shape: `SiteAPI#getItems` resolves `{ local, others }`.

## `mountComponent` (`@dnpm-dip/vue/testing`)

Mounts a Vue component with the full plugin chain a real page would see,
backed by a fake HTTP client:

```ts
import { mountComponent } from '@dnpm-dip/vue/testing';

const { wrapper, client, pinia } = mountComponent(
    MyComponent,
    { someProp: 'value' }, // props
    { 'GET /mtb/sites': () => ({ local: { code: 'site-a' }, others: [] }) }, // handlers
);
```

The plugin **install order is load-bearing** — each step depends on the
previous one being in place:

1. **pinia** — installed first; stores are `defineStore` factories and there
   is no ambient injection context outside of Nuxt.
2. **`@vuecs/core`** — first-install-wins theme manager, so it must install
   before anything that touches vuecs theming.
3. **`@authup/client-web-kit`** — must install before the portal's own
   `install`: the portal install calls `injectHTTPClientAuthenticationHook(app)`
   internally and throws if authup hasn't provided its hook yet.
   - `isServer: true` is mandatory here: it maps to authup's internal
     `timer: !isServer`, suppressing the token-refresh timer. Without it,
     every spec that mounts a component leaks a live timer past teardown.
4. **the portal's `install`** — provides the fake `HTTPClient` explicitly as
   `httpClient`. Providing it before this step would be silently ignored;
   `install`'s early-return only picks up a client passed at this call.
5. **the caller's `onApp` hook** — runs last, after the base client is
   already provided but still before `mount()` (so a component's `setup()`
   sees whatever the hook provides). Feature modules use this slot to layer
   their own module-scoped client on top of the base fake client.

`stubs: { VCIcon: true }` is also mandatory: `<VCIcon>` resolves icon names
through `@iconify/vue`, which fetches unknown icons from the Iconify API
over the network. Left live, every icon-rendering spec would make a real
HTTP request that `happy-dom` aborts at teardown. Stubbing by component
*name* (rather than relying on a global registration) is required because it
also catches the `VCIcon` that `@vuecs/button` imports directly.

### Globally-resolved components do not resolve under the harness

`install()` registers exactly **one** global component (`DKVTable`). The
portal's `app.use(vuecs, ...)` chain — which is what makes `VCTable`,
`VCTableEmpty`, `VCPagination` and `VCFormCheckbox` resolvable in the running
app — is deliberately **not** part of `mountComponent`. Any component that
resolves a `VC*` globally instead of importing it (the `VCTable` family by
[convention](conventions.md#vue--nuxt-conventions), plus anything that has
drifted from the explicit-import rule) therefore renders as an unresolved
element in a spec.

The consequence is a real constraint on what a spec may assert: rendered rows,
checkbox labels and pagination controls are **not reachable**. This is why the
mtb/rd filter specs assert on `instance.vm.*` and `client.requests`, and on
wrapper elements the component's own template owns (e.g. `.form-check`), rather
than on the vuecs children. Adding an assertion on a `VC*` child requires
installing that vuecs package in the harness first — do that deliberately, not
by reflex.

## Per-Module Test Helpers

`admin`, `mtb` and `rd` each add a `test/utils/index.ts` with two thin
wrappers around the shared harness, scoped to that module's own client type
(mirrored across all three modules — keep them in sync, see
[conventions.md](conventions.md#keep-mtb-and-rd-modules-in-sync)):

```ts
// packages/mtb/test/utils/index.ts
export function createModuleClient(handlers: FakeHandlerMap = {}) {
    const client = createFakeClient({ handlers });
    const moduleClient = new MTBAPIClient(client);
    return { client, moduleClient };
}

export function mountModuleComponent(component, props = {}, handlers = {}) {
    let moduleClient: MTBAPIClient | undefined;
    const mounted = mountComponent(component, props, handlers, {
        onApp: (app, client) => {
            moduleClient = new MTBAPIClient(client);
            provideHTTPClient(moduleClient, app);
        },
    });
    return { ...mounted, moduleClient: moduleClient! };
}
```

`createModuleClient` is for testing a module's domain/service layer directly
(no component mount); `mountModuleComponent` is `mountComponent` with the
module's own client layered in via the `onApp` hook described above.
