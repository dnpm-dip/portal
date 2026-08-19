# Package Split & Test Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `@dnpm-dip/core` into `kit` / `http-kit` / `vue`, rename today's `kit` to `nuxt-kit`, and give every package a real Vitest suite backed by a transport-level fake HTTP client.

**Architecture:** Test infrastructure lands **first**, inside the existing `core` package, so the 295-file import rewrite that follows has a regression net. The fake client is a subclass of the real client with only hapic's `MemoryTransport` swapped in, so hooks, header merging, auth attachment and the error pipeline all still run. Only then do the packages split; the specs move with their subjects and their assertions do not change.

**Tech Stack:** TypeScript (ESM, `strict`, `noUncheckedIndexedAccess`), Vue 3, Nuxt 4, Vitest 4, `@vue/test-utils`, happy-dom, hapic 3, Pinia 4, Nx, tsdown.

**Spec:** `docs/superpowers/specs/2026-08-19-package-split-and-test-infrastructure-design.md`

## Global Constraints

- **Node.js `>=24.0.0`**. Package manager is npm with workspaces.
- **`npm install` runs plain** — never `--force`, never `--legacy-peer-deps`. Only ONE install changes THIRD-PARTY dependencies (Task 1); the installs in Tasks 5-9 exist solely to create workspace symlinks for new packages and are required. After each, run the flat-tree check; anything printed is a split singleton:
  ```bash
  find packages/*/node_modules -maxdepth 2 -type d \
      \( -name pinia -o -name validup -o -name vue -o -name client-web-kit \)
  ```
- **`noUncheckedIndexedAccess: true`** (from `@tada5hi/tsconfig`). Every `array[i]` is `T | undefined` and must be guarded. Code copied from PrivateAIM/hub will NOT compile unmodified.
- **`verbatimModuleSyntax: true`** — type-only imports must use `import type`.
- **Conventional Commits** (`type(scope): description`). Scopes are package names: `core`, `kit`, `http-kit`, `vue`, `nuxt-kit`, `portal`, `mtb`, `rd`, `admin`, `deps`.
- **No AI-attribution trailers** in commit messages, PR titles, or bodies. No `Co-Authored-By: Claude`. This overrides default agent tooling guidance.
- **Never hand-edit** `CHANGELOG.md`, `package.json` `version` fields, or `.release-please-manifest.json` versions — release-please owns them. Adding/removing package *entries* is allowed.
- **Indentation is 4 spaces.** No explanatory comments unless the reasoning is non-obvious.
- **Vue components:** explicit `@vuecs/*` imports; Options-API SFCs also register in `components: {}`. `VCTable` family stays global.
- **Portal wire shapes** (not hub's): collections are `{ entries, size?, limit?, offset? }`; errors are `{ issues: [{ severity, details }] }`.

---

## File Structure

**Phase 1 — new files inside the existing `core` package:**

| File | Responsibility |
| --- | --- |
| `packages/core/test/vitest.config.ts` | Vitest config: happy-dom, vue plugin, `test/unit/**/*.spec.ts` |
| `packages/core/src/testing/types.ts` | `FakeRequest`, `FakeHandler`, `FakeHandlerMap`, `FakeClientOptions` |
| `packages/core/src/testing/matcher.ts` | `matchRoute` — `:param` patterns, `'*'` catch-all |
| `packages/core/src/testing/module.ts` | `FakeClient`, `createFakeClient`, `fakeResponse` |
| `packages/core/src/testing/mount.ts` | `mountComponent` harness for component specs |
| `packages/core/src/testing/index.ts` | Barrel for the `./testing` subpath |

**Phase 2 — the package layout the moves produce:**

| Package | Holds |
| --- | --- |
| `packages/kit` | framework-free utils (`clone`, `debounce`, `has-own-property`, `is-object`, `template`, `url-query`, `color/*`, `ObjectLiteral`) |
| `packages/nuxt-kit` | today's `packages/kit` verbatim (`registerPages`, `generateNuxtPages`, `parseSegment`) |
| `packages/http-kit` | `domains/**`, `client/`, `resource/`, `testing/` |
| `packages/vue` | `components/**`, `composables/**`, `stores/**`, `services/**`, DI/install, `testing/mount.ts` |

---

## Phase 1 — Test infrastructure (lands in `core`, before any move)

### Task 1: Fake HTTP client and Vitest wiring

**Files:**
- Modify: `package.json` (root — add two devDependencies)
- Modify: `packages/core/package.json` (add `test` script, `./testing` export)
- Modify: `packages/core/src/core/http-client/types.ts:5`
- Create: `packages/core/test/vitest.config.ts`
- Create: `packages/core/src/testing/{types,matcher,module,index}.ts`
- Test: `packages/core/test/unit/testing/{matcher,fake-client}.spec.ts`

**Interfaces:**
- Consumes: nothing (first task).
- Produces:
  - `createFakeClient(options?: FakeClientOptions): FakeClient`
  - `FakeClient extends HTTPClient` with `readonly requests: FakeRequest[]`
  - `fakeResponse(status: number, body?: any): Response`
  - `matchRoute(method: string, url: string, handlers: FakeHandlerMap): RouteMatch | null`
  - `type FakeRequest = { method: string, url: string, body?: unknown, params: Record<string,string>, headers: Record<string,string> }`
  - `type FakeHandler = (request: FakeRequest) => unknown | Promise<unknown>`
  - `type FakeHandlerMap = Record<string, FakeHandler>`
  - `type FakeClientOptions = HTTPClientOptions & { handlers?: FakeHandlerMap, fallback?: FakeHandler }`

- [ ] **Step 1: Add the two test devDependencies**

Only `@vue/test-utils` and `happy-dom` are missing; `vitest@4.1.11` and `@vitejs/plugin-vue@6.0.8` are already installed. Add to the ROOT `package.json` `devDependencies`, keeping alphabetical order:

```json
"@vue/test-utils": "^2.4.6",
"happy-dom": "^20.0.0",
```

Then run ONE install and verify the tree did not split:

```bash
npm install
find packages/*/node_modules -maxdepth 2 -type d \
    \( -name pinia -o -name validup -o -name vue -o -name client-web-kit \)
```

Expected: the `find` prints NOTHING. If it prints anything, stop and run
`rm -rf node_modules packages/*/node_modules package-lock.json && npm install`.

- [ ] **Step 2: Make the client options able to carry a transport**

`packages/core/src/core/http-client/types.ts` currently starts:

```ts
import type { RequestBaseOptions } from 'hapic';
import type { APIClientErrorIssueSeverity } from './constants';

export type HTTPClientOptions = RequestBaseOptions;
```

`RequestBaseOptions` has no `transport` field, so no test can inject one. Change it to:

```ts
import type { ClientOptionsInput } from 'hapic';
import type { APIClientErrorIssueSeverity } from './constants';

export type HTTPClientOptions = ClientOptionsInput;
```

Leave the rest of the file untouched.

- [ ] **Step 3: Create the Vitest config**

Create `packages/core/test/vitest.config.ts`:

```ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['test/unit/**/*.spec.ts'],
    },
    plugins: [vue()],
});
```

Add the script to `packages/core/package.json` `scripts`:

```json
"test": "vitest run --config test/vitest.config.ts"
```

- [ ] **Step 4: Write the failing matcher test**

Create `packages/core/test/unit/testing/matcher.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { matchRoute } from '../../../src/testing';

describe('matchRoute', () => {
    it('should capture named parameters', () => {
        const match = matchRoute('GET', '/mtb/queries/abc', {
            'GET /mtb/queries/:id': () => ({}),
        });

        expect(match).not.toBeNull();
        expect(match?.params).toEqual({ id: 'abc' });
    });

    it('should ignore the query string', () => {
        const match = matchRoute('GET', '/mtb/queries/abc?limit=10', {
            'GET /mtb/queries/:id': () => ({}),
        });

        expect(match?.params).toEqual({ id: 'abc' });
    });

    it('should not match a different segment count', () => {
        const match = matchRoute('GET', '/mtb/queries', {
            'GET /mtb/queries/:id': () => ({}),
        });

        expect(match).toBeNull();
    });

    it('should not match a different method', () => {
        const match = matchRoute('POST', '/mtb/queries/abc', {
            'GET /mtb/queries/:id': () => ({}),
        });

        expect(match).toBeNull();
    });

    it('should prefer a specific pattern over the catch-all regardless of key order', () => {
        const specific = () => ({ picked: 'specific' });
        const match = matchRoute('GET', '/mtb/sites', {
            '*': () => ({ picked: 'catch-all' }),
            'GET /mtb/sites': specific,
        });

        expect(match?.handler).toBe(specific);
    });

    it('should fall back to the catch-all when nothing matches', () => {
        const catchAll = () => ({ picked: 'catch-all' });
        const match = matchRoute('GET', '/nowhere', { '*': catchAll });

        expect(match?.handler).toBe(catchAll);
        expect(match?.params).toEqual({});
    });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm run test --workspace=packages/core`
Expected: FAIL — cannot resolve `../../../src/testing`.

- [ ] **Step 6: Implement the testing types and matcher**

Create `packages/core/src/testing/types.ts`:

```ts
import type { HTTPClientOptions } from '../core/http-client';

export type FakeRequest = {
    method: string,
    url: string,
    body?: unknown,
    params: Record<string, string>,
    headers: Record<string, string>
};

export type FakeHandler = (request: FakeRequest) => unknown | Promise<unknown>;

export type FakeHandlerMap = Record<string, FakeHandler>;

export type FakeClientOptions = HTTPClientOptions & {
    handlers?: FakeHandlerMap,
    fallback?: FakeHandler
};
```

Create `packages/core/src/testing/matcher.ts`. Note the `pathSegment` and
`handler` guards — `noUncheckedIndexedAccess` makes every index access
`T | undefined`, so hub's version does not compile here:

```ts
import type { FakeHandler, FakeHandlerMap } from './types';

export type RouteMatch = {
    handler: FakeHandler,
    params: Record<string, string>
};

function matchPath(pattern: string, path: string) : Record<string, string> | null {
    const patternSegments = pattern.split('/').filter(Boolean);
    const pathSegments = path.split('/').filter(Boolean);

    if (patternSegments.length !== pathSegments.length) {
        return null;
    }

    const params : Record<string, string> = {};
    for (const [index, patternSegment] of patternSegments.entries()) {
        const pathSegment = pathSegments[index];
        if (typeof pathSegment === 'undefined') {
            return null;
        }

        if (patternSegment.startsWith(':')) {
            params[patternSegment.slice(1)] = pathSegment;
        } else if (patternSegment !== pathSegment) {
            return null;
        }
    }

    return params;
}

export function matchRoute(
    method: string,
    url: string,
    handlers: FakeHandlerMap,
) : RouteMatch | null {
    const path = new URL(url, 'http://localhost').pathname;

    let catchAll : RouteMatch | null = null;

    for (const key of Object.keys(handlers)) {
        const handler = handlers[key];
        if (typeof handler === 'undefined') {
            continue;
        }

        if (key === '*') {
            catchAll = { handler, params: {} };
            continue;
        }

        const separatorIndex = key.indexOf(' ');
        if (separatorIndex === -1) {
            continue;
        }

        if (key.slice(0, separatorIndex).toUpperCase() !== method) {
            continue;
        }

        const params = matchPath(key.slice(separatorIndex + 1), path);
        if (params) {
            return { handler, params };
        }
    }

    return catchAll;
}
```

Create `packages/core/src/testing/index.ts`:

```ts
export * from './matcher';
export * from './module';
export * from './types';
```

- [ ] **Step 7: Run the matcher test to verify it passes**

Run: `npm run test --workspace=packages/core`
Expected: the six `matchRoute` tests PASS. `./module` does not exist yet, so
resolution of the barrel will still fail — create `module.ts` in the next step
and re-run.

- [ ] **Step 8: Write the failing fake-client test**

Create `packages/core/test/unit/testing/fake-client.spec.ts`:

```ts
import { isClientError } from 'hapic';
import { describe, expect, it } from 'vitest';
import { createFakeClient, fakeResponse } from '../../../src/testing';

describe('FakeClient', () => {
    it('should answer a routed request and record it', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/sites': () => ({
                    local: { code: 'site-a', display: 'Standort A' },
                    others: [{ code: 'site-b', display: 'Standort B' }],
                }),
            },
        });

        const response = await client.site.getItems('mtb');

        expect(response.local.code).toBe('site-a');
        expect(response.others).toHaveLength(1);
        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
    });

    it('should expose captured route parameters', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/queries/:id': (request) => ({ id: request.params.id }),
            },
        });

        await client.query.getOne('mtb', 'abc');

        expect(client.requests[0]?.params).toEqual({ id: 'abc' });
    });

    it('should default to an empty portal collection when nothing matches', async () => {
        const client = createFakeClient();

        const response = await client.valueSet.getMany();

        expect(response).toEqual({ entries: [], size: 0 });
    });

    it('should drive a non-2xx through the real hapic error pipeline', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/sites': () => fakeResponse(500, {
                    issues: [{ severity: 'error', details: 'boom' }],
                }),
            },
        });

        await expect(client.site.getItems('mtb')).rejects.toSatisfy(isClientError);
    });

    it('should parse a JSON request body back out', async () => {
        const client = createFakeClient({
            handlers: {
                'POST /mtb/queries': () => ({ id: 'created' }),
            },
        });

        await client.post('mtb/queries', { mode: { code: 'local' } });

        expect(client.requests[0]?.body).toEqual({ mode: { code: 'local' } });
    });
});
```

- [ ] **Step 9: Run the test to verify it fails**

Run: `npm run test --workspace=packages/core`
Expected: FAIL — `createFakeClient` is not exported.

- [ ] **Step 10: Implement the fake client**

Create `packages/core/src/testing/module.ts`. `TransportRequest.url` is
required but `method` is optional (it comes from `RequestInit`), and a
`responseType: 'stream'` request dispatches with no method — hence the `'GET'`
default:

```ts
import { MemoryTransport } from 'hapic';
import type { MemoryResponseInit, TransportRequest } from 'hapic';
import { HTTPClient } from '../core/http-client';
import { matchRoute } from './matcher';
import type {
    FakeClientOptions,
    FakeHandler,
    FakeHandlerMap,
    FakeRequest,
} from './types';

const defaultFallback : FakeHandler = () => ({ entries: [], size: 0 });

export function fakeResponse(status: number, body?: any) : Response {
    return new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
    });
}

function normalizeBody(input: unknown) : unknown {
    if (input instanceof URLSearchParams) {
        return Object.fromEntries(input);
    }

    if (typeof input === 'string') {
        try {
            return JSON.parse(input);
        } catch {
            return input;
        }
    }

    return input;
}

export class FakeClient extends HTTPClient {
    public readonly requests : FakeRequest[];

    constructor(options: FakeClientOptions = {}) {
        const {
            handlers,
            fallback,
            ...clientOptions
        } = options;

        const requests : FakeRequest[] = [];
        const map : FakeHandlerMap = handlers ?? {};
        const fb : FakeHandler = fallback ?? defaultFallback;

        const transport = new MemoryTransport({
            fetch: async (request: TransportRequest) : Promise<Response | MemoryResponseInit> => {
                const method = (request.method ?? 'GET').toUpperCase();
                const match = matchRoute(method, request.url, map);

                const headers : Record<string, string> = {};
                new Headers(request.headers).forEach((value, key) => {
                    headers[key.toLowerCase()] = value;
                });

                const entry : FakeRequest = {
                    method,
                    url: request.url,
                    body: normalizeBody(request.body),
                    params: match ? match.params : {},
                    headers,
                };
                requests.push(entry);

                const data = match ?
                    await match.handler(entry) :
                    await fb(entry);

                if (data instanceof Response) {
                    return data;
                }

                return { status: 200, body: data };
            },
        });

        super({
            ...clientOptions,
            baseURL: clientOptions.baseURL ?? 'http://fake.test',
            transport,
        });

        this.requests = requests;
    }
}

export function createFakeClient(options: FakeClientOptions = {}) : FakeClient {
    return new FakeClient(options);
}
```

The `baseURL` default is deliberately **path-free**: `matchRoute` matches the
full pathname, so a `baseURL` carrying a path would stop every pattern from
matching.

- [ ] **Step 11: Run the tests to verify they pass**

Run: `npm run test --workspace=packages/core`
Expected: all 11 tests PASS.

- [ ] **Step 12: Export the testing subpath**

In `packages/core/package.json`, add to `exports` (after the `.` entry):

```json
"./testing": {
    "types": "./dist/testing/index.d.ts",
    "import": "./dist/testing/index.mjs"
}
```

In `packages/core/tsdown.config.ts`, change the single entry to two:

```ts
entry: ['src/index.ts', 'src/testing/index.ts'],
```

Confirm the build still succeeds:

Run: `npm run build --workspace=packages/core`
Expected: exit 0, and `packages/core/dist/testing/index.mjs` exists.

- [ ] **Step 13: Lint and commit**

```bash
npx eslint --fix packages/core/src/testing packages/core/test
git add package.json package-lock.json packages/core
git commit -m "test(core): add transport-level fake http client and vitest wiring"
```

---

### Task 2: Domain API and utility specs

**Files:**
- Test: `packages/core/test/unit/domains/{site,query,code-system,value-set,prepared-query,validation}.spec.ts`
- Test: `packages/core/test/unit/core/resource/collection-utils.spec.ts`
- Test: `packages/core/test/unit/utils/url-query.spec.ts`

**Interfaces:**
- Consumes: `createFakeClient`, `fakeResponse` from Task 1.
- Produces: no new source symbols — this task is specs only. It establishes the
  request-assertion idiom (`client.requests[0]?.url`) reused by Tasks 4, 11 and 13.

- [ ] **Step 1: Write the failing domain API specs**

These assert the two things a domain API class actually does: build the right
URL, and unwrap `response.data`. Create
`packages/core/test/unit/domains/site.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('SiteAPI', () => {
    it('should address the use-case scoped sites endpoint', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/sites': () => ({
                    local: { code: 'a', display: 'A' },
                    others: [{ code: 'b', display: 'B' }],
                }),
            },
        });

        const response = await client.site.getItems('mtb');

        expect(client.requests[0]?.url).toContain('/mtb/sites');
        expect(response.local.code).toBe('a');
        expect(response.others).toHaveLength(1);
    });

    it('should scope by the given use case', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /rd/sites': () => ({ local: { code: 'a' }, others: [] }),
            },
        });

        await client.site.getItems('rd');

        expect(client.requests[0]?.url).toContain('/rd/sites');
    });
});
```

**`SiteAPI` is the one collection-shaped endpoint that is NOT a
`ResourceCollectionResponse`.** It returns `SiteResponse = { local: Coding,
others: Coding[] }`. Every fixture must match its method's DECLARED return type
— a fixture invented from prose passes trivially, because the fake echoes
whatever the handler returns, and then the spec asserts the fake rather than the
API. Read the return type before writing each fixture.

Create `packages/core/test/unit/domains/query.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('QueryAPI', () => {
    it('should read one query by id', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/queries/:id': (request) => ({ id: request.params.id }),
            },
        });

        const response = await client.query.getOne('mtb', 'q-1');

        expect(response.id).toBe('q-1');
    });

    it('should read the patient filter of a query', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/queries/:id/filters/patient': () => ({ gender: { items: [] } }),
            },
        });

        await client.query.getPatientFilter('mtb', 'q-1');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/filters/patient');
    });
});
```

Create `packages/core/test/unit/domains/code-system.spec.ts`. Note `getOne`
addresses the COLLECTION endpoint with a `uri` query parameter, and repeats
`filter` once per value:

```ts
import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('CodeSystemAPI', () => {
    it('should read the code system collection', async () => {
        const client = createFakeClient({
            handlers: { 'GET /coding/codesystems': () => ({ entries: [], size: 0 }) },
        });

        await client.codeSystem.getMany();

        expect(client.requests[0]?.url).toContain('/coding/codesystems');
    });

    it('should address one code system by uri, not by path segment', async () => {
        const client = createFakeClient({
            handlers: { 'GET /coding/codesystems': () => ({ entries: [], size: 0 }) },
        });

        await client.codeSystem.getOne('http://loinc.org');

        expect(client.requests[0]?.url).toContain('uri=http://loinc.org');
    });

    it('should repeat the filter parameter once per value', async () => {
        const client = createFakeClient({
            handlers: { 'GET /coding/codesystems': () => ({ entries: [], size: 0 }) },
        });

        await client.codeSystem.getOne('http://loinc.org', ['a', 'b']);

        const url = client.requests[0]?.url ?? '';
        expect(url).toContain('filter=a');
        expect(url).toContain('filter=b');
    });
});
```

Create `packages/core/test/unit/domains/value-set.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createFakeClient } from '../../../src/testing';

describe('ValueSetAPI', () => {
    it('should read the value set collection', async () => {
        const client = createFakeClient({
            handlers: { 'GET /coding/valuesets': () => ({ entries: [], size: 0 }) },
        });

        await client.valueSet.getMany();

        expect(client.requests[0]?.url).toContain('/coding/valuesets');
    });

    it('should omit the version parameter when none is given', async () => {
        const client = createFakeClient({
            handlers: { 'GET /coding/valuesets': () => ({ entries: [], size: 0 }) },
        });

        await client.valueSet.getOne('urn:vs');

        expect(client.requests[0]?.url).not.toContain('version=');
    });

    it('should include the version parameter when given', async () => {
        const client = createFakeClient({
            handlers: { 'GET /coding/valuesets': () => ({ entries: [], size: 0 }) },
        });

        await client.valueSet.getOne('urn:vs', '2.0');

        expect(client.requests[0]?.url).toContain('version=2.0');
    });
});
```

`PreparedQueryAPI` and `ValidationAPI` are NOT sub-APIs of `HTTPClient` — only
the feature-module clients construct them, with a `useCase`. Their specs
therefore instantiate them directly. Create
`packages/core/test/unit/domains/prepared-query.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { PreparedQueryAPI } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

describe('PreparedQueryAPI', () => {
    it('should scope every route by the use case', async () => {
        const client = createFakeClient({
            handlers: { 'GET /mtb/prepared-queries': () => ({ entries: [], size: 0 }) },
        });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.getMany();

        expect(client.requests[0]?.url).toContain('/mtb/prepared-queries');
    });

    it('should default a missing name to a timestamp on create', async () => {
        const client = createFakeClient({
            handlers: { 'POST /mtb/prepared-queries': () => ({ id: 'pq-1' }) },
        });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.create({} as any);

        const body = client.requests[0]?.body as { name?: string };
        expect(body.name).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should keep a supplied name untouched on create', async () => {
        const client = createFakeClient({
            handlers: { 'POST /mtb/prepared-queries': () => ({ id: 'pq-1' }) },
        });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.create({ name: 'Meine Abfrage' } as any);

        expect((client.requests[0]?.body as { name?: string }).name).toBe('Meine Abfrage');
    });

    it('should patch on update', async () => {
        const client = createFakeClient({
            handlers: { 'PATCH /mtb/prepared-queries/:id': () => ({ id: 'pq-1' }) },
        });
        const api = new PreparedQueryAPI({ client, useCase: 'mtb' });

        await api.update('pq-1', { name: 'Neu' } as any);

        expect(client.requests[0]?.method).toBe('PATCH');
        expect(client.requests[0]?.params).toEqual({ id: 'pq-1' });
    });
});
```

Create `packages/core/test/unit/domains/validation.spec.ts` covering
`getReportInfo` (`{useCase}/validation/infos`), `getReport`
(`{useCase}/validation/report/:id`) and `getPatientRecord`
(`{useCase}/validation/patient-record/:id`), constructed the same way with
`new ValidationAPI({ client, useCase: 'mtb' })`.

- [ ] **Step 2: Run to verify they fail**

Run: `npm run test --workspace=packages/core`
Expected: FAIL on any endpoint whose URL you guessed wrong. Correct the SPEC to
match the source, not the other way round — these APIs are already in production.

- [ ] **Step 3: Write the utility specs**

Create `packages/core/test/unit/core/resource/collection-utils.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { ResourceCollectionSortDirection } from '../../../../src/core';
import { stringifyResourceCollectionMeta } from '../../../../src/core';

describe('stringifyResourceCollectionMeta', () => {
    it('should return an empty string for empty meta', () => {
        expect(stringifyResourceCollectionMeta({})).toBe('');
    });

    it('should serialize limit and offset', () => {
        const output = stringifyResourceCollectionMeta({ limit: 10, offset: 20 });

        expect(output.startsWith('?')).toBe(true);
        expect(output).toContain('limit=10');
        expect(output).toContain('offset=20');
    });

    it('should prefix a descending sort key with a minus', () => {
        const output = stringifyResourceCollectionMeta({
            sort: { createdAt: ResourceCollectionSortDirection.DESC },
        });

        expect(output).toContain('sort=-createdAt');
    });

    it('should leave an ascending sort key bare', () => {
        const output = stringifyResourceCollectionMeta({
            sort: { createdAt: ResourceCollectionSortDirection.ASC },
        });

        expect(output).toContain('sort=createdAt');
    });
});
```

Create `packages/core/test/unit/utils/url-query.spec.ts` asserting
`serializeURLQueryRecord` against its real behaviour — read
`packages/core/src/utils/url-query.ts` first and cover: a flat record, a record
with an array value, and an empty record.

- [ ] **Step 4: Run the full suite**

Run: `npm run test --workspace=packages/core`
Expected: PASS.

- [ ] **Step 5: Lint and commit**

```bash
npx eslint --fix packages/core/test
git add packages/core/test
git commit -m "test(core): cover domain api url construction and resource meta"
```

---

### Task 3: Component mount harness

**Files:**
- Modify: `packages/core/src/types.ts` (add `httpClient` to `InstallOptions`)
- Modify: `packages/core/src/core/http-client/{types,install}.ts`
- Create: `packages/core/src/testing/mount.ts`
- Modify: `packages/core/src/testing/index.ts`
- Test: `packages/core/test/unit/components/d-fact.spec.ts`

**Interfaces:**
- Consumes: `createFakeClient`, `FakeHandlerMap` from Task 1.
- Produces:
  - `mountComponent(component: Component, props?: Record<string, any>, handlers?: FakeHandlerMap, options?: MountOptions): { wrapper: VueWrapper, client: FakeClient, pinia: Pinia }`
  - `type MountOptions = { onApp?: (app: App, client: FakeClient) => void }` — runs BEFORE mount
  - `InstallOptions` gains `httpClient?: HTTPClient`
  - `BaseHTTPClientInstallOptions` gains `client?: HTTPClient`

- [ ] **Step 1: Let the install accept a prebuilt client**

Pre-providing a fake is NOT safe: `installHTTPClient` early-returns on
`isHTTPIClientInjected(app)` and `provide` is first-wins, so an ordering mistake
fails silently with the real client winning. Make it explicit instead.

In `packages/core/src/core/http-client/types.ts`, extend the install options:

```ts
export type BaseHTTPClientInstallOptions = {
    baseURL?: string,
    client?: HTTPClient
};
```

Add the import it now needs at the top of that file:

```ts
import type { HTTPClient } from './module';
```

In `packages/core/src/core/http-client/install.ts`, use a supplied client when
one is given:

```ts
export function installHTTPClient(app: App, options: BaseHTTPClientInstallOptions) {
    if (isHTTPIClientInjected(app)) {
        return;
    }

    const client = options.client || new Client({ baseURL: options.baseURL });

    setupBaseHTTPClient(app, client);

    provideHTTPClient(client, app);
}
```

In `packages/core/src/types.ts`, extend `InstallOptions`:

```ts
export type InstallOptions = {
    baseURL: string,
    httpClient?: HTTPClient
};
```

with `import type { HTTPClient } from './core';` added at the top.

In `packages/core/src/install.ts`, forward it:

```ts
installHTTPClient(app, { baseURL: options.baseURL, client: options.httpClient });
```

- [ ] **Step 2: Write the failing component spec**

`DFact` is the right first subject: it is a small presentational component with
a label, an optional icon and a slotted value, so it proves the harness mounts
and renders without depending on any request. Create
`packages/core/test/unit/components/d-fact.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import DFact from '../../../src/components/utility/DFact.vue';
import { mountComponent } from '../../../src/testing';

describe('DFact', () => {
    it('should render the label', () => {
        const { wrapper } = mountComponent(DFact, { label: 'Diagnose' }, {});

        expect(wrapper.text()).toContain('Diagnose');
    });

    it('should render the slotted value', () => {
        const { wrapper } = mountComponent(DFact, { label: 'Diagnose' }, {});

        expect(wrapper.html()).toBeTruthy();
    });
});
```

Read `packages/core/src/components/utility/DFact.vue` before writing this and
adjust the prop names and assertions to what the component actually declares.

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test --workspace=packages/core`
Expected: FAIL — `mountComponent` is not exported.

- [ ] **Step 4: Implement the harness**

Create `packages/core/src/testing/mount.ts`. The install ORDER is load-bearing
and each line is commented because a wrong order fails silently rather than
loudly:

```ts
import { install as authupInstall } from '@authup/client-web-kit';
import { createFakeClient as createFakeAuthupClient } from '@authup/core-http-kit/testing';
import { mount } from '@vue/test-utils';
import vuecs from '@vuecs/core';
import { createPinia } from 'pinia';
import type { App, Component } from 'vue';
import { install } from '../install';
import { createFakeClient } from './module';
import type { FakeClient } from './module';
import type { FakeHandlerMap } from './types';

const noop = () => undefined;

export type MountOptions = {
    /**
     * Runs against the app BEFORE mount, so whatever it provides is visible
     * to the component's setup(). Feature modules use it to provide their own
     * client on top of the base one — providing after mount would be too late.
     */
    onApp?: (app: App, client: FakeClient) => void
};

export function mountComponent(
    component: Component,
    props: Record<string, any> = {},
    handlers: FakeHandlerMap = {},
    options: MountOptions = {},
) {
    const pinia = createPinia();
    const client = createFakeClient({ handlers });

    const wrapper = mount(component, {
        props,
        global: {
            // VCIcon resolves through @iconify/vue, which fetches an unknown
            // icon from the iconify API. Left live, every icon-rendering spec
            // makes a real request and happy-dom aborts it at teardown.
            // Stubbing by NAME also catches the VCIcon that @vuecs/button
            // imports directly, which a global registration would not.
            stubs: { VCIcon: true },
            plugins: [
                // 1. pinia — the stores are defineStore factories, and there
                //    is no ambient injection context outside Nuxt.
                pinia,
                // 2. @vuecs/core — first-install-wins theme manager.
                [vuecs, {}],
                // 3. authup BEFORE core: core's setupBaseHTTPClient calls
                //    injectHTTPClientAuthenticationHook(app) and throws
                //    without it. isServer:true maps to `timer: !isServer`,
                //    so no refresh timer leaks between specs.
                [{ install: authupInstall }, {
                    baseURL: 'http://authup.fake.test',
                    httpClient: createFakeAuthupClient({
                        handlers: {
                            'POST /token': () => ({
                                access_token: 'xyz',
                                token_type: 'Bearer',
                                expires_in: 3600,
                            }),
                        },
                    }),
                    pinia,
                    isServer: true,
                    cookieGet: noop,
                    cookieSet: noop,
                    cookieUnset: noop,
                }],
                // 4. core, with the fake passed EXPLICITLY — pre-providing
                //    would be silently ignored by the early-return.
                [{ install }, {
                    baseURL: 'http://core.fake.test',
                    httpClient: client,
                }],
                // 5. Caller hook — LAST, so the base client is already
                //    provided, but still before mount, so setup() sees it.
                { install: (app: App) => options.onApp?.(app, client) },
            ],
        },
    });

    return { wrapper, client, pinia };
}
```

Add to `packages/core/src/testing/index.ts`:

```ts
export * from './mount';
```

Add `@vue/test-utils` and `happy-dom` to `packages/core/package.json`
`devDependencies` so the workspace declares what it imports.

- [ ] **Step 5: Run to verify it passes**

Run: `npm run test --workspace=packages/core`
Expected: PASS. If authup throws about a missing store, the install order is
wrong — authup must come before core.

- [ ] **Step 6: Lint and commit**

```bash
npx eslint --fix packages/core/src packages/core/test
git add packages/core
git commit -m "test(core): add component mount harness with fake http client"
```

---

### Task 4: Feature-module test wiring

**Files:**
- Create: `packages/{mtb,rd,admin}/test/vitest.config.ts`
- Create: `packages/{mtb,rd,admin}/test/utils/index.ts`
- Modify: `packages/{mtb,rd,admin}/package.json` (test script, devDependencies)
- Test: `packages/mtb/test/unit/domains/query.spec.ts`
- Test: `packages/rd/test/unit/domains/query.spec.ts`
- Test: `packages/admin/test/unit/domains/connection-report.spec.ts`

**Interfaces:**
- Consumes: `createFakeClient`, `mountComponent`, `FakeHandlerMap` from Tasks 1 and 3.
- Produces, in each module's `test/utils/index.ts`:
  - `mountModuleComponent(component: Component, props?: Record<string, any>, handlers?: FakeHandlerMap): { wrapper: VueWrapper, client: FakeClient, moduleClient: MTBAPIClient | RDHTTPClient | AdminAPIClient }`
  - `createModuleClient(handlers?: FakeHandlerMap): { client: FakeClient, moduleClient: ... }`

- [ ] **Step 1: Create the mtb Vitest config**

Create `packages/mtb/test/vitest.config.ts`. The alias is what lets specs run
without a prior build and stops them going stale against `dist`:

```ts
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['test/unit/**/*.spec.ts'],
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@dnpm-dip/core/testing': path.resolve(__dirname, '../../core/src/testing'),
            '@dnpm-dip/core': path.resolve(__dirname, '../../core/src'),
        },
    },
});
```

The longer alias key MUST come first — Vite matches prefixes in order, so
`@dnpm-dip/core` would otherwise swallow `@dnpm-dip/core/testing`.

Add to `packages/mtb/package.json` `scripts`:

```json
"test": "vitest run --config test/vitest.config.ts"
```

and add `@vue/test-utils` + `happy-dom` to its `devDependencies`.

Repeat verbatim for `packages/rd` and `packages/admin`.

- [ ] **Step 2: Write the failing mtb query API spec**

Create `packages/mtb/test/unit/domains/query.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createModuleClient } from '../../utils';

describe('mtb QueryAPI', () => {
    it('should default the request mode to local on submit', async () => {
        const { client, moduleClient } = createModuleClient({
            'POST /mtb/queries': () => ({ id: 'q-1' }),
        });

        await moduleClient.query.submit({} as any);

        expect(client.requests[0]?.body).toMatchObject({ mode: { code: 'local' } });
    });

    it('should address the patient-matches endpoint with pagination', async () => {
        const { client, moduleClient } = createModuleClient({
            'GET /mtb/queries/:id/patient-matches': () => ({ entries: [], size: 0 }),
        });

        await moduleClient.query.getPatients('q-1', { limit: 10, offset: 0 });

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/patient-matches');
        expect(client.requests[0]?.url).toContain('limit=10');
    });

    it('should append the survival-statistics query string only when given', async () => {
        const { client, moduleClient } = createModuleClient({
            'GET /mtb/queries/:id/survival-statistics': () => ({ data: [] }),
        });

        await moduleClient.query.getKaplanMeierStatistics('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test --workspace=packages/mtb`
Expected: FAIL — `../../utils` does not exist.

- [ ] **Step 4: Implement the mtb test utils**

Create `packages/mtb/test/utils/index.ts`:

```ts
import { createFakeClient, mountComponent } from '@dnpm-dip/core/testing';
import type { FakeHandlerMap } from '@dnpm-dip/core/testing';
import type { Component } from 'vue';
import { MTBAPIClient, provideHTTPClient } from '../../src/runtime/core/http-client';

export function createModuleClient(handlers: FakeHandlerMap = {}) {
    const client = createFakeClient({ handlers });
    const moduleClient = new MTBAPIClient(client);

    return { client, moduleClient };
}

export function mountModuleComponent(
    component: Component,
    props: Record<string, any> = {},
    handlers: FakeHandlerMap = {},
) {
    let moduleClient : MTBAPIClient | undefined;

    const mounted = mountComponent(component, props, handlers, {
        onApp: (app, client) => {
            moduleClient = new MTBAPIClient(client);
            provideHTTPClient(moduleClient, app);
        },
    });

    return { ...mounted, moduleClient: moduleClient as MTBAPIClient };
}
```

The module client MUST be provided through `onApp`, not after `mountComponent`
returns: a component that injects it in `setup()` runs during mount, so a later
`provide` would arrive too late and the inject would throw.

`MTBAPIClient` already takes an injected `HTTPClient` in its constructor, so
the fake needs no module-side change at all.

- [ ] **Step 5: Run to verify it passes**

Run: `npm run test --workspace=packages/mtb`
Expected: PASS.

- [ ] **Step 6: Mirror for rd and admin**

Create the same two files for `rd` (using `RDHTTPClient` from
`../../src/runtime/core`) and `admin` (using its client from
`../../src/runtime/core/http-client`). Read each module's `http-client/module.ts`
first for the exact class name and constructor.

Write one API spec per module against its real endpoints:
- `packages/rd/test/unit/domains/query.spec.ts`
- `packages/admin/test/unit/domains/connection-report.spec.ts`

- [ ] **Step 7: Run every suite**

Run: `npm run test`
Expected: `core`, `mtb`, `rd` and `admin` all report passing suites — and for
the first time `nx run-many -t test` actually runs something.

- [ ] **Step 8: Lint and commit**

```bash
npx eslint --fix packages/mtb packages/rd packages/admin
git add packages/mtb packages/rd packages/admin
git commit -m "test(mtb,rd,admin): add vitest wiring and module client specs"
```

**CHECKPOINT — the regression net now exists.** Every task after this point is a
refactor, and `npm run test` is the thing that proves it did not break.

---

## Phase 2 — The split

### Task 5: Rename `kit` to `nuxt-kit`

**Files:**
- Move: `packages/kit/` -> `packages/nuxt-kit/`
- Modify: `packages/nuxt-kit/package.json` (name, repository directory)
- Modify: `packages/{admin,mtb,rd}/src/module.ts:1` (import specifier)
- Modify: `packages/{admin,mtb,rd}/package.json` (dependency name)
- Modify: `packages/portal/nuxt.config.ts` (alias)

**Interfaces:**
- Consumes: nothing.
- Produces: `@dnpm-dip/nuxt-kit` exporting `registerPages(ctx: PagesRegisterContext): Promise<void>` — the same symbol `@dnpm-dip/kit` exports today, at a new specifier. The `@dnpm-dip/kit` NAME is freed for Task 6.

- [ ] **Step 1: Move the directory with history**

```bash
git mv packages/kit packages/nuxt-kit
```

- [ ] **Step 2: Rename the package**

In `packages/nuxt-kit/package.json`, change two fields only — leave `version`
alone, release-please owns it:

```json
"name": "@dnpm-dip/nuxt-kit",
```

and inside `repository`:

```json
"directory": "packages/nuxt-kit"
```

- [ ] **Step 3: Update the three consumers**

`registerPages` is the only symbol in use, imported at line 1 of each module:

```bash
sed -i '' "s|from '@dnpm-dip/kit'|from '@dnpm-dip/nuxt-kit'|g" \
    packages/admin/src/module.ts \
    packages/mtb/src/module.ts \
    packages/rd/src/module.ts
```

In each of `packages/{admin,mtb,rd}/package.json`, rename the dependency key
`"@dnpm-dip/kit"` to `"@dnpm-dip/nuxt-kit"`, keeping its version range.

In `packages/portal/nuxt.config.ts`, update the alias block:

```ts
alias: {
    '@dnpm-dip/core': path.join(__dirname, '..', 'core', 'src'),
    '@dnpm-dip/nuxt-kit': path.join(__dirname, '..', 'nuxt-kit', 'src'),
},
```

- [ ] **Step 4: Verify**

```bash
npm install
npm run build
grep -rn "@dnpm-dip/kit" packages --include="*.ts" --include="*.json" | grep -v node_modules
```

Expected: build exits 0, and the `grep` prints NOTHING.

- [ ] **Step 5: Commit**

```bash
git add -A packages
git commit -m "refactor(kit): rename to @dnpm-dip/nuxt-kit"
```

---

### Task 6: Create `@dnpm-dip/kit` for framework-free utils

**Files:**
- Create: `packages/kit/{package.json,tsconfig.json,tsconfig.build.json,tsdown.config.ts}`
- Move: `packages/core/src/utils/*` -> `packages/kit/src/` (except `ref.ts`)
- Create: `packages/kit/src/{index.ts,types.ts}`
- Test: `packages/kit/test/{vitest.config.ts,unit/url-query.spec.ts}`

**Interfaces:**
- Consumes: nothing.
- Produces `@dnpm-dip/kit` exporting: `clone`, `debounce`, `hasOwnProperty`,
  `isObject`, `template`, `serializeURLQueryRecord`, `URLQueryRecord`, the
  `color/*` helpers, and `type ObjectLiteral = Record<string, any>`.

- [ ] **Step 1: Scaffold the package**

Create `packages/kit/package.json`. Copy the `author`, `license`, `bugs`,
`homepage` and `publishConfig` blocks verbatim from
`packages/nuxt-kit/package.json` so metadata stays consistent:

```json
{
    "name": "@dnpm-dip/kit",
    "type": "module",
    "version": "0.0.0",
    "description": "Framework-free utilities for DNPM:DIP apps and packages.",
    "exports": {
        "./package.json": "./package.json",
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.mjs"
        }
    },
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "files": ["dist/"],
    "scripts": {
        "build:types": "tsc --emitDeclarationOnly -p tsconfig.build.json",
        "build:js": "tsdown",
        "build": "npm run build:js && npm run build:types",
        "test": "vitest run --config test/vitest.config.ts"
    }
}
```

Copy `tsconfig.json`, `tsconfig.build.json` and `tsdown.config.ts` from
`packages/nuxt-kit/` unchanged — the tsdown config is generic (it reads the
sibling `package.json` for `neverBundle`).

- [ ] **Step 2: Move the utilities**

```bash
mkdir -p packages/kit/src
git mv packages/core/src/utils/clone.ts            packages/kit/src/clone.ts
git mv packages/core/src/utils/debounce.ts         packages/kit/src/debounce.ts
git mv packages/core/src/utils/has-own-property.ts packages/kit/src/has-own-property.ts
git mv packages/core/src/utils/is-object.ts        packages/kit/src/is-object.ts
git mv packages/core/src/utils/template.ts         packages/kit/src/template.ts
git mv packages/core/src/utils/url-query.ts        packages/kit/src/url-query.ts
git mv packages/core/src/utils/color             packages/kit/src/color
```

`packages/core/src/utils/ref.ts` stays — it imports `Ref` from `vue` and
belongs to the Vue package.

- [ ] **Step 3: Write the barrel and shared type**

Create `packages/kit/src/types.ts`:

```ts
export type ObjectLiteral = Record<string, any>;
```

Create `packages/kit/src/index.ts`:

```ts
export * from './clone';
export * from './color';
export * from './debounce';
export * from './has-own-property';
export * from './is-object';
export * from './template';
export * from './types';
export * from './url-query';
```

Remove the `ObjectLiteral` declaration from `packages/core/src/types.ts` and
re-export it there instead, so nothing in `core` breaks yet:

```ts
export type { ObjectLiteral } from '@dnpm-dip/kit';
```

- [ ] **Step 4: Repoint `core` at the new package**

Add `"@dnpm-dip/kit": "^0.0.0"` to `packages/core/package.json`
`dependencies`. Then rewrite the intra-core imports that used to reach
`src/utils`:

```bash
grep -rln "from '\(\.\./\)*utils'" packages/core/src --include="*.ts" --include="*.vue"
```

For each hit, replace the relative specifier with `'@dnpm-dip/kit'`. Keep
`packages/core/src/utils/index.ts` exporting only `./ref`, and keep
`export * from './utils'` in `packages/core/src/index.ts` so `core`'s public
surface is unchanged for now.

- [ ] **Step 5: Move the util spec across**

```bash
mkdir -p packages/kit/test/unit
git mv packages/core/test/unit/utils/url-query.spec.ts packages/kit/test/unit/url-query.spec.ts
```

Update its import to `from '../../src'`. Create
`packages/kit/test/vitest.config.ts` — no vue plugin and the default node
environment are correct here, this package has no DOM:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/unit/**/*.spec.ts'],
    },
});
```

- [ ] **Step 6: Verify and commit**

```bash
npm install
npm run build
npm run test
npx eslint --fix packages/kit packages/core
git add -A packages
git commit -m "refactor(kit): extract framework-free utils from core"
```

Expected: build and all suites PASS.

---

### Task 7: Create `@dnpm-dip/http-kit`

**Files:**
- Create: `packages/http-kit/{package.json,tsconfig.json,tsconfig.build.json,tsdown.config.ts}`
- Move: `packages/core/src/domains/**` -> `packages/http-kit/src/domains/`
- Move: `packages/core/src/core/http-client/{module,types,error,helper,constants}.ts` -> `packages/http-kit/src/client/`
- Move: `packages/core/src/core/resource/{collection,record}/utils.ts` -> `packages/http-kit/src/resource/`
- Move: `packages/core/src/testing/{types,matcher,module,index}.ts` -> `packages/http-kit/src/testing/`
- Move: `packages/core/test/unit/{domains,core/resource}` -> `packages/http-kit/test/unit/`
- Create: `packages/http-kit/src/{index.ts,constants.ts}`

**Interfaces:**
- Consumes: `@dnpm-dip/kit` from Task 6.
- Produces `@dnpm-dip/http-kit` exporting: every domain type, `BaseAPI`,
  `CodeSystemAPI`, `QueryAPI`, `SiteAPI`, `ValueSetAPI`, `PreparedQueryAPI`,
  `ValidationAPI`, their `I*API` interfaces, `HTTPClient`, `IHTTPClient`,
  `HTTPClientOptions`, `APIClientErrorIssueSeverity`,
  `extractAPIClientErrorIssues`, `isAPIClientErrorPayload`,
  `ResourceCollectionSortDirection`, `stringifyResourceCollectionMeta`,
  `defineResourceCollectionEvents`, `LogicalOperator`; and at `./testing`:
  `createFakeClient`, `FakeClient`, `fakeResponse`, `matchRoute` and the fake types.

- [ ] **Step 1: Scaffold the package**

Create `packages/http-kit/package.json` mirroring Task 6's shape, with:

```json
"name": "@dnpm-dip/http-kit",
"description": "HTTP client, domain models and interfaces for DNPM:DIP.",
"exports": {
    "./package.json": "./package.json",
    ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.mjs"
    },
    "./testing": {
        "types": "./dist/testing/index.d.ts",
        "import": "./dist/testing/index.mjs"
    }
},
"dependencies": {
    "@dnpm-dip/kit": "^0.0.0",
    "hapic": "^3.0.2",
    "smob": "^1.6.2",
    "ufo": "^1.6.2"
}
```

In its `tsdown.config.ts` set `entry: ['src/index.ts', 'src/testing/index.ts']`.

- [ ] **Step 2: Move the sources**

```bash
mkdir -p packages/http-kit/src/{client,resource}
git mv packages/core/src/domains      packages/http-kit/src/domains
git mv packages/core/src/testing      packages/http-kit/src/testing

for f in module types error helper constants; do
    git mv "packages/core/src/core/http-client/$f.ts" "packages/http-kit/src/client/$f.ts"
done
```

`types.ts` carries one type that must NOT go with it:
`BaseHTTPClientInstallOptions` is an install-time option consumed by
`install.ts`, which stays in the Vue package. Move that declaration back into
`packages/core/src/core/http-client/types.ts` (recreating the file with just
that type), leaving `HTTPClientOptions`, `HTTPClientErrorIssue` and
`HTTPClientErrorPayload` in http-kit:

```ts
// packages/core/src/core/http-client/types.ts — recreated, Vue-side only
import type { HTTPClient } from '@dnpm-dip/http-kit';

export type BaseHTTPClientInstallOptions = {
    baseURL?: string,
    client?: HTTPClient
};
```

Then move the resource utilities:

```bash
git mv packages/core/src/core/resource/collection/utils.ts packages/http-kit/src/resource/collection-utils.ts
git mv packages/core/src/core/resource/record/utils.ts     packages/http-kit/src/resource/record-utils.ts
```

`packages/core/src/testing/mount.ts` was created in Task 3 and is Vue-bound —
if the `git mv` of the directory carried it along, move it back:

```bash
git mv packages/http-kit/src/testing/mount.ts packages/core/src/testing/mount.ts
```

and drop its `export * from './mount';` line from the http-kit testing barrel.

`mount.ts` imported `createFakeClient` from `'./module'`, which no longer sits
beside it. Repoint that one import:

```ts
import { createFakeClient } from '@dnpm-dip/http-kit/testing';
import type { FakeHandlerMap } from '@dnpm-dip/http-kit/testing';
```

- [ ] **Step 3: Split the straddling constants**

Create `packages/http-kit/src/constants.ts`:

```ts
export enum LogicalOperator {
    AND = 'and',
    OR = 'or',
}
```

Delete the `LogicalOperator` enum from `packages/core/src/constants.ts` and
re-export it there for now:

```ts
export { LogicalOperator } from '@dnpm-dip/http-kit';
```

Create `packages/http-kit/src/resource/constants.ts` holding only the sort
direction, which `collection-utils.ts` needs:

```ts
export enum ResourceCollectionSortDirection {
    DESC = 'desc',
    ASC = 'asc',
}
```

Leave `ResourceSlotName` in `packages/core/src/core/resource/constants.ts` and
re-export the sort direction from `@dnpm-dip/http-kit` there.

- [ ] **Step 4: Move the `FormOption` helper out of `domains`**

`packages/http-kit/src/domains/coding/utils.ts` imports
`type { FormOption } from '@vuecs/forms'` — the one Vue import in the pure half.
Move ONLY that function into `packages/core/src/components/core/coding/`,
re-exporting it from the core coding barrel. Everything else in the file stays.

Confirm nothing Vue-shaped remains:

```bash
grep -rnE "from '(vue|pinia|@vuecs/|@authup/client-web-kit|vue-chartjs|chart\.js)'" packages/http-kit/src
```

Expected: NOTHING printed. This is the invariant that makes `http-kit`
framework-free.

- [ ] **Step 5: Add the interfaces**

For each API class, declare an interface beside it naming the same methods with
the same signatures. Read each `api.ts` first and mirror it exactly. Example,
in `packages/http-kit/src/domains/site/types.ts`:

```ts
export interface ISiteAPI {
    getItems(useCase: string) : Promise<SiteResponse>;
}
```

and in `packages/http-kit/src/domains/site/api.ts`:

```ts
export class SiteAPI extends BaseAPI implements ISiteAPI { /* unchanged body */ }
```

Then in `packages/http-kit/src/client/types.ts`, add the client contract.
Members are typed as INTERFACES, not the concrete classes, so the contract
stays structural and a `src`-copy meeting a `dist`-copy cannot trip over
`BaseAPI`'s `protected client`:

```ts
import type { ClientOptionsInput, IClient } from 'hapic';
import type {
    ICodeSystemAPI,
    IQueryAPI,
    ISiteAPI,
    IValueSetAPI,
} from '../domains';

export type HTTPClientOptions = ClientOptionsInput;

export interface IHTTPClient extends IClient {
    readonly codeSystem : ICodeSystemAPI;
    readonly query : IQueryAPI;
    readonly site : ISiteAPI;
    readonly valueSet : IValueSetAPI;
}
```

and in `packages/http-kit/src/client/module.ts`:

```ts
export class HTTPClient extends BaseClient implements IHTTPClient { /* unchanged body */ }
```

- [ ] **Step 6: Write the barrel**

Create `packages/http-kit/src/index.ts`:

```ts
export * from './client';
export * from './constants';
export * from './domains';
export * from './resource';
```

with `client/index.ts`, `resource/index.ts` re-exporting their own files.

- [ ] **Step 7: Move the specs and wire Vitest**

```bash
mkdir -p packages/http-kit/test/unit
git mv packages/core/test/unit/domains        packages/http-kit/test/unit/domains
git mv packages/core/test/unit/testing        packages/http-kit/test/unit/testing
git mv packages/core/test/unit/core/resource  packages/http-kit/test/unit/resource
```

Fix the relative import depth in every moved spec (they used
`../../../src/testing`; recompute per file). Create
`packages/http-kit/test/vitest.config.ts` — node environment, no vue plugin.

- [ ] **Step 8: Repoint `core` and verify**

Add `"@dnpm-dip/http-kit": "^0.0.0"` to `packages/core/package.json`
dependencies. Rewrite core's intra-package imports of the moved modules to
`'@dnpm-dip/http-kit'`, and keep `core`'s barrel re-exporting them so its
public surface is still unchanged.

```bash
npm install
npm run build
npm run test
npx eslint --fix packages/http-kit packages/core
git add -A packages
git commit -m "refactor(http-kit): extract domains, client and interfaces from core"
```

Expected: build and every suite PASS. Specs moved in Step 7 assert the same
behaviour they asserted in Task 2 — if any now fails, the move broke something.

---

### Task 8: Create `@dnpm-dip/vue`

**Files:**
- Move: `packages/core/` -> `packages/vue/` (what remains after Tasks 6-7)
- Modify: `packages/vue/package.json` (name, description, exports)

**Interfaces:**
- Consumes: `@dnpm-dip/kit`, `@dnpm-dip/http-kit`.
- Produces `@dnpm-dip/vue` exporting everything `@dnpm-dip/core` exported that
  is not now in `kit` or `http-kit`: all components, composables, stores,
  services, `install`, the DI helpers (`injectHTTPClient`, `provideHTTPClient`),
  `PageMetaKey`, `ModuleType`, `QueryFilterURLKey`, `ModuleMeta`,
  `InstallOptions`; and at `./testing`: `mountComponent`.

- [ ] **Step 1: Move what remains**

```bash
git mv packages/core packages/vue
```

- [ ] **Step 2: Rename and re-export**

In `packages/vue/package.json`: set `"name": "@dnpm-dip/vue"`, update
`description` and `repository.directory`, and add the `./testing` export
entry pointing at `./dist/testing/index.d.ts` / `./dist/testing/index.mjs`.
Set `entry: ['src/index.ts', 'src/testing/index.ts']` in its
`tsdown.config.ts`.

Delete the temporary compatibility re-exports added in Tasks 6 and 7 — the
`export type { ObjectLiteral } from '@dnpm-dip/kit'`, the
`export { LogicalOperator } from '@dnpm-dip/http-kit'` and the sort-direction
re-export. Consumers import those from their real homes as of Task 9.

Keep `packages/vue/src/index.ts` exporting only what `vue` itself owns:

```ts
export * from './components';
export * from './composables';
export * from './constants';
export * from './core';
export * from './install';
export * from './services';
export * from './stores';
export * from './types';
export * from './utils';
```

- [ ] **Step 3: Retype the DI helpers against the interface**

This is what makes a fake acceptable at every call site without a cast. In
`packages/vue/src/core/http-client/di.ts`, swap the concrete class for the
contract:

```ts
import type { IHTTPClient } from '@dnpm-dip/http-kit';

export function provideHTTPClient(client: IHTTPClient, app?: App) {
    provide(APIClientSymbol, client, app);
}

export function injectHTTPClient(app?: App) : IHTTPClient {
    const instance = inject<IHTTPClient>(APIClientSymbol, app);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance;
}
```

Do the same for `BaseHTTPClientInstallOptions.client` and
`InstallOptions.httpClient` (both added in Task 3) — they become `IHTTPClient`.
`installHTTPClient` still constructs the concrete `HTTPClient` when no client is
supplied, which satisfies the interface.

Run the suite: `npm run test --workspace=packages/vue`. The mount harness passes
a `FakeClient`, so if the DI types were wrong this fails to compile.

- [ ] **Step 4: Verify and commit**

```bash
npm install
npm run build --workspace=packages/vue
npx eslint --fix packages/vue
git add -A packages
git commit -m "refactor(vue): rename core to @dnpm-dip/vue"
```

The feature modules and the portal are still importing `@dnpm-dip/core` and are
expected to be BROKEN at this point. Task 9 repairs them; do not try to fix
them here.

---

### Task 9: Rewrite the consumers and retire `core`

**Files:**
- Modify: ~295 files across `packages/{admin,mtb,rd,portal}` importing `@dnpm-dip/core`
- Modify: `packages/{admin,mtb,rd,portal}/package.json` (dependencies)
- Modify: `packages/portal/nuxt.config.ts` (alias, css)
- Modify: `packages/{mtb,rd,admin}/test/vitest.config.ts` (alias)

**Interfaces:**
- Consumes: `@dnpm-dip/kit`, `@dnpm-dip/http-kit`, `@dnpm-dip/vue`.
- Produces: no new symbols. Ends with zero references to `@dnpm-dip/core`.

- [ ] **Step 1: Build the symbol-to-package map**

The three packages export disjoint symbol sets, so each old
`from '@dnpm-dip/core'` import splits deterministically. Collect the real
export lists rather than guessing:

```bash
collect() {
    {
        grep -rhoE "^export (async )?(function|class|abstract class|const|enum|interface|type) [A-Za-z0-9_]+" "$1" --include="*.ts" | awk '{print $NF}'
        grep -rhoE "^export \{ default as [A-Za-z0-9_]+" "$1" --include="*.ts" | awk '{print $NF}'
    } | sort -u
}

collect packages/kit/src      > /tmp/exports-kit.txt
collect packages/http-kit/src > /tmp/exports-http-kit.txt
collect packages/vue/src      > /tmp/exports-vue.txt
comm -12 /tmp/exports-kit.txt /tmp/exports-http-kit.txt
comm -12 /tmp/exports-http-kit.txt /tmp/exports-vue.txt
```

Expected: both `comm` calls print NOTHING. An overlap means a symbol is
exported from two packages and the rewrite would be ambiguous — fix the barrels
before continuing.

- [ ] **Step 2: Rewrite the imports**

For each file importing `@dnpm-dip/core`, look up every named import in the
three lists and emit one import statement per owning package, preserving
`import type` where it was used. Process the packages in dependency order
(`admin`, `mtb`, `rd`, then `portal`) and commit after each so a regression is
bisectable.

```bash
grep -rl "@dnpm-dip/core" packages/mtb --include="*.ts" --include="*.vue"
```

- [ ] **Step 3: Update the manifests and configs**

In each of `packages/{admin,mtb,rd,portal}/package.json`, replace the
`"@dnpm-dip/core"` dependency with the three it actually uses:

```json
"@dnpm-dip/kit": "^0.0.0",
"@dnpm-dip/http-kit": "^0.0.0",
"@dnpm-dip/vue": "^0.0.0",
```

In `packages/portal/nuxt.config.ts`, update the alias block:

```ts
alias: {
    '@dnpm-dip/kit': path.join(__dirname, '..', 'kit', 'src'),
    '@dnpm-dip/http-kit': path.join(__dirname, '..', 'http-kit', 'src'),
    '@dnpm-dip/vue': path.join(__dirname, '..', 'vue', 'src'),
    '@dnpm-dip/nuxt-kit': path.join(__dirname, '..', 'nuxt-kit', 'src'),
},
```

and the stylesheet entry in the `css` array, which pointed at core's built CSS:

```ts
'@dnpm-dip/vue/../dist/index.css',
```

In `packages/{mtb,rd,admin}/test/vitest.config.ts`, replace the two core
aliases with the new ones — longest key first:

```ts
alias: {
    '@dnpm-dip/vue/testing': path.resolve(__dirname, '../../vue/src/testing'),
    '@dnpm-dip/http-kit/testing': path.resolve(__dirname, '../../http-kit/src/testing'),
    '@dnpm-dip/vue': path.resolve(__dirname, '../../vue/src'),
    '@dnpm-dip/http-kit': path.resolve(__dirname, '../../http-kit/src'),
    '@dnpm-dip/kit': path.resolve(__dirname, '../../kit/src'),
},
```

and update each module's `test/utils/index.ts` imports accordingly
(`createFakeClient` now from `@dnpm-dip/http-kit/testing`, `mountComponent`
from `@dnpm-dip/vue/testing`).

- [ ] **Step 4: Give each module client its own contract**

Mirror the `IHTTPClient` treatment for the three module clients so their DI is
substitutable too. In `packages/mtb/src/runtime/core/http-client/module.ts`:

```ts
import type {
    IPreparedQueryAPI,
    IValidationAPI,
} from '@dnpm-dip/http-kit';
import type { IKaplanMeierAPI, IQueryAPI } from '../../domains';

export interface IMTBAPIClient {
    readonly kaplanMeier : IKaplanMeierAPI;
    readonly preparedQuery : IPreparedQueryAPI;
    readonly query : IQueryAPI;
    readonly validation : IValidationAPI;
}

export class MTBAPIClient implements IMTBAPIClient { /* unchanged body */ }
```

Declare `IKaplanMeierAPI` and mtb's own `IQueryAPI` beside their classes in
`packages/mtb/src/runtime/domains/*/types.ts`, mirroring each method signature
exactly — read the `api.ts` first.

Then retype mtb's DI in `packages/mtb/src/runtime/core/http-client/di.ts`:

```ts
export function provideHTTPClient(client: IMTBAPIClient, app?: App) { /* … */ }
export function injectHTTPClient() : IMTBAPIClient { /* … */ }
```

Repeat for `rd` (`IRDHTTPClient`) and `admin` (`IAdminAPIClient`), reading each
module's client and domain APIs for the real method sets.

- [ ] **Step 5: Verify exhaustively**

```bash
npm install
npm run build
npm run test
npm run lint
npx nuxt typecheck --workspace=packages/portal
grep -rn "@dnpm-dip/core" packages --include="*.ts" --include="*.vue" --include="*.json" | grep -v node_modules
```

Expected: build, test and typecheck exit 0, and the final `grep` prints NOTHING.

**`npm run lint` does NOT exit clean, and is not expected to.** The repository
carries **34 pre-existing eslint errors** across 19 files
(`unicorn/no-useless-template-literals` x33,
`unicorn/prefer-number-is-safe-integer` x1) that predate this branch. The gate
is therefore **"no NEW errors attributable to this branch"**, not "zero errors".
Verify it that way:

```bash
comm -12 <(git diff --name-only <merge-base>..HEAD | sort)          <(npm run lint 2>&1 | grep -E "^/.*/(packages|docs)/"            | sed "s|$(pwd)/||" | sort -u)
```

Expected: EMPTY. Any file listed is one this branch touched AND that lints
dirty — that IS a finding. Note that four of the erroring files move packages in
Phase 2, so their errors follow them to new paths and the baseline stays 34.

- [ ] **Step 6: Commit**

```bash
git add -A packages
git commit -m "refactor(portal,mtb,rd,admin): consume kit, http-kit and vue"
```

---

### Task 10: Release plumbing, icon globs and docs

**Files:**
- Modify: `release-please-config.json`, `.release-please-manifest.json`
- Modify: `packages/portal/nuxt.config.ts:43` (icon scan glob)
- Modify: `.agents/{structure,architecture,testing,conventions}.md`

**Interfaces:**
- Consumes: the package layout from Tasks 5-9.
- Produces: no code symbols.

- [ ] **Step 1: Fix the icon bundle scan**

`NuxtIconBundle`'s `scan.globInclude` lists packages by PATH and **fails
silently** — a missing package yields empty icon slots in the browser, never a
build error, and an SSR render cannot disprove it because `@iconify/vue`
resolves client-side. Line 43 currently reads:

```ts
'packages/{admin,core,kit,mtb,rd,theme}/src/**/*.{vue,ts}',
```

Change it to:

```ts
'packages/{admin,http-kit,kit,mtb,nuxt-kit,rd,theme,vue}/src/**/*.{vue,ts}',
```

- [ ] **Step 2: Verify the icon count did not drop**

```bash
npm run build --workspace=packages/portal 2>&1 | grep "Nuxt Icon bundled"
grep -rhoE "fa6-(solid|brands):[a-z0-9-]+" \
    packages/portal/{app,error}.vue \
    packages/portal/{components,config,core,layouts,middleware,pages,plugins,stores} \
    packages/{admin,http-kit,kit,mtb,nuxt-kit,rd,theme,vue}/src \
    node_modules/@authup/client-web-kit/dist \
    node_modules/@vuecs/icons-font-awesome/dist 2>/dev/null | sort -u | wc -l
```

Expected: the two numbers agree. A low bundled count means a glob is wrong.

- [ ] **Step 3: Update release-please**

In `release-please-config.json` `packages`, remove the `packages/core` entry and
add one per new package, each with a `component` matching its directory name:
`packages/http-kit` -> `http-kit`, `packages/vue` -> `vue`,
`packages/nuxt-kit` -> `nuxt-kit`, `packages/admin` -> `admin` (missing today).
Add the same components to the `linked-versions` plugin's `components` array
alongside the existing ones.

In `.release-please-manifest.json`, remove `"packages/core"` and the stale
`"packages/rare-diseases"` entry, and add the new paths at `"0.0.0"`. Do not
edit any other version value.

- [ ] **Step 4: Update the agent docs**

- `.agents/structure.md` — replace the package table and the dependency-layer
  block with the layout from Task 5-9. Update the "Core Package Structure"
  section to describe `http-kit` and `vue`.
- `.agents/architecture.md` — update the layered-architecture diagram and the
  `NuxtIconBundle` paragraph's package list.
- `.agents/testing.md` — this file currently describes a setup that did not
  exist. Rewrite it to describe what now does: the per-package
  `test/vitest.config.ts`, the `src`-aliasing that removes the build
  prerequisite, `createFakeClient` with its handler-map syntax, `mountComponent`
  and the install-order constraint, and the behavioural-assertions-only rule.
- `.agents/conventions.md` — add a short section stating the package boundary
  invariant: nothing in `kit` or `http-kit` may import `vue`, `pinia`,
  `@vuecs/*` or `@authup/client-web-kit`, with the grep that checks it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: update release config, icon globs and agent docs for the split"
```

---

## Phase 3 — Broad coverage

Each task below is a coverage sweep. The harness is already proven, so these
add specs only — no source changes except where a spec exposes a real defect.
For every sweep: behavioural assertions only, no DOM snapshots.

### Task 11: `http-kit` coverage

**Files:**
- Test: `packages/http-kit/test/unit/domains/*.spec.ts` (one per domain)
- Test: `packages/http-kit/test/unit/resource/*.spec.ts`

**Interfaces:**
- Consumes: `createFakeClient`, `fakeResponse` from `../../src/testing`.
- Produces: no source symbols.

- [ ] **Step 1: Cover every remaining domain API**

Tasks 2 and 7 already cover `site`, `query`, `code-system`, `value-set`,
`prepared-query` and `validation`. Add specs for every API method not yet
touched. For each method assert: the URL built (including query string), the
HTTP method, the request body where one is sent, and the unwrapped return value.

- [ ] **Step 2: Cover the error path**

For at least one API, assert that a `fakeResponse(400, { issues: [...] })`
rejects with a `ClientError` carrying the portal issue payload, using
`extractAPIClientErrorIssues` to read it back:

```ts
import { extractAPIClientErrorIssues } from '../../../src';
```

- [ ] **Step 3: Cover `record-utils` and `defineResourceCollectionEvents`**

Read each function first and assert its real contract.

- [ ] **Step 4: Run, lint, commit**

```bash
npm run test --workspace=packages/http-kit
npx eslint --fix packages/http-kit/test
git add packages/http-kit/test
git commit -m "test(http-kit): cover remaining domain apis and error path"
```

---

### Task 12: `vue` coverage

**Files:**
- Test: `packages/vue/test/unit/components/**/*.spec.ts`
- Test: `packages/vue/test/unit/stores/*.spec.ts`

**Interfaces:**
- Consumes: `mountComponent` from `../../src/testing`.
- Produces: no source symbols.

- [ ] **Step 1: Cover the query-filter store**

The store is plain reactive state behind `defineStore`, so it can be exercised
through `mountComponent`'s pinia. Assert: `setItems` then `hasItem` is true;
`setItems` with `[]` clears; `reset` empties everything; and
`buildQueryFiltersURLRecord` produces the expected record. Read
`packages/vue/src/stores/query-filter/{module,helper}.ts` first.

- [ ] **Step 2: Cover the query-session store**

Same approach, against its real surface.

- [ ] **Step 3: Cover the utility components**

One spec each for `DFact`, `DCommaList`, `DTags`, `DKVTable`,
`DLogicalOperatorSwitch`. For each: mount with representative props, assert
rendered text, and where the component emits, assert the emission after
triggering the interaction. `DLogicalOperatorSwitch` in particular should
assert that toggling flips `and` <-> `or` and emits `update:modelValue`.

- [ ] **Step 4: Cover the query components that issue requests**

For `QuerySummaryDemographics` and `DSitePicker`, mount with a handler map and
assert against `client.requests` that the expected endpoint was called, plus
the rendered outcome.

- [ ] **Step 5: Run, lint, commit**

```bash
npm run test --workspace=packages/vue
npx eslint --fix packages/vue/test
git add packages/vue/test
git commit -m "test(vue): cover stores and shared components"
```

---

### Task 13: Feature-module coverage

**Files:**
- Test: `packages/{mtb,rd,admin}/test/unit/{domains,components}/*.spec.ts`

**Interfaces:**
- Consumes: `createModuleClient`, `mountModuleComponent` from each module's
  `test/utils/index.ts` (Task 4).
- Produces: no source symbols.

- [ ] **Step 1: Finish the mtb API surface**

`QueryAPI` in mtb is the largest API in the repo. Cover every method not
already covered in Task 4: the three filter reads, `getPatientRecord`,
`getTherapyResponses`, `getCoarseTherapyResponses`, `getGeneAlterationInfos`,
`getGeneAlterationDistributions`, `getTumorDiagnostics`, `getMedication`,
`getDemographics`, `update`. Assert the URL and, for the paginated ones, that
`stringifyResourceCollectionMeta` reached the query string.

Also cover `KaplanMeierAPI`.

- [ ] **Step 2: Cover mtb components**

Specs for `MQuerySummaryCoarseTherapyResponses`,
`MTherapyResponseDistributionBar`, `MQueryDiagnosisFilter` and
`MGeneAlterationText`. Mount via `mountModuleComponent`, feed representative
domain fixtures as props, assert rendered text and emitted events.

- [ ] **Step 3: Mirror for rd**

Per `.agents/conventions.md`, `mtb` and `rd` expose parallel patterns and must
stay in sync. For every mtb component spec written in Step 2, check for the
`R*` equivalent (`MQueryDiagnosisFilter` -> `RQueryDiagnosisFilter`) and write
the matching spec. Cover rd's `QueryAPI` methods and the `RVariant` family.

- [ ] **Step 4: Cover admin**

Cover the connection-report API and `AConnectionReport`.

- [ ] **Step 5: Run, lint, commit**

```bash
npm run test
npx eslint --fix packages/mtb packages/rd packages/admin
git add packages/mtb packages/rd packages/admin
git commit -m "test(mtb,rd,admin): cover module apis and components"
```

---

### Task 14: Final verification

**Files:** none — this task only verifies.

- [ ] **Step 1: Run the definition of done**

Each command must pass before the branch is considered complete:

```bash
npm run build
npm run test
npx nuxt typecheck --workspace=packages/portal
grep -rn "@dnpm-dip/core" packages --include="*.ts" --include="*.vue" --include="*.json" | grep -v node_modules
find packages/*/node_modules -maxdepth 2 -type d \
    \( -name pinia -o -name validup -o -name vue -o -name client-web-kit \)
grep -rnE "from '(vue|pinia|@vuecs/|@authup/client-web-kit)'" packages/kit/src packages/http-kit/src
find node_modules -name reactivity -type d -path "*@vue*"
```

Expected: the three commands exit 0; the four `grep`/`find` checks print
NOTHING (a single line from the last one is correct — more than one means the
`vue` override desynced).

Lint is verified DIFFERENTIALLY, not absolutely — the repo has 34 pre-existing
errors that predate this branch (see Task 9 Step 5). Run:

```bash
comm -12 <(git diff --name-only $(git merge-base master HEAD)..HEAD | sort)          <(npm run lint 2>&1 | grep -E "^/.*/(packages|docs)/"            | sed "s|$(pwd)/||" | sort -u)
```

Expected: EMPTY. A non-empty result means this branch introduced lint debt.

- [ ] **Step 2: Confirm the docs match reality**

Re-read `.agents/testing.md` and run every command it documents. It described a
fiction before this branch; it must not describe one after.

- [ ] **Step 3: Commit any fixes and open the PR**

No AI-attribution lines in the title or body.

---

## Notes for the executor

- **Tasks 5-9 are one refactor split into bisectable commits.** The tree is
  expected to be broken between Task 8 and Task 9. Do not "fix" the feature
  modules early.
- **The suite is the contract.** From the Task 4 checkpoint onward, any spec
  that starts failing during Phase 2 means the move broke behaviour. Fix the
  move, never the assertion.
- **Read before you write.** Several steps say "read the source first" — the
  API surfaces here are production endpoints and this plan deliberately does not
  restate every signature. Guessing an endpoint produces a spec that tests the
  fake instead of the code.
