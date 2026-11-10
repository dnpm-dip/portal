<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/http-kit</h1>

<p align="center">
    <b>HTTP client, domain models and interfaces for DNPM:DIP.</b><br>
    Typed calls for queries, sites, prepared queries, validation reports and coding systems on top of hapic,<br>
    plus a fake client that runs the real request pipeline in tests without a network.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/http-kit"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fhttp-kit%2Fpackage.json&label=version" alt="version" /></a>
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/main.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
</p>

<p align="center">
    <a href="#installation"><b>Installation</b></a>
    ·
    <a href="#usage">Usage</a>
    ·
    <a href="#testing">Testing</a>
    ·
    <a href="#api">API</a>
    ·
    <a href="#notes">Notes</a>
</p>

---

## Why @dnpm-dip/http-kit?

The DNPM:DIP API serves several use cases (`mtb`, `rd`) under the same URL shapes: `<useCase>/queries/:id`,
`<useCase>/sites`, `<useCase>/prepared-queries`, `<useCase>/validation/…`. Every consumer needs the same paths,
response types and error shape, and every test needs a way to answer those calls.

| Concern | With plain `fetch` | With @dnpm-dip/http-kit |
|---|---|---|
| **Paths** | String-built per call site | One method per endpoint, the use case as a parameter: `client.site.getItems('mtb')` |
| **Response types** | `any`, or types copied into each module | `QueryBase`, `SiteResponse`, `ValidationReport`, `Coding`, … next to an `I*API` interface per domain |
| **API errors** | Parse `{ issues: [...] }` by hand | `extractAPIClientErrorIssues(error)` returns the typed issue list |
| **Tests** | Mock `fetch`, skipping the client's own error handling | `createFakeClient` swaps only the transport; hapic still builds requests and raises errors |
| **Framework** | — | None: no Vue or Nuxt import, usable from a server, a script or a test |

```typescript
import { HTTPClient } from '@dnpm-dip/http-kit';

const client = new HTTPClient({ baseURL: 'https://dnpm-dip.net/api/' });

const sites = await client.site.getItems('mtb');
const query = await client.query.getOne('mtb', 'b1c7…');
```

## Installation

```bash
npm install @dnpm-dip/http-kit --save
```

ESM only, with type declarations. Depends on [`hapic`](https://www.npmjs.com/package/hapic) and
[`@dnpm-dip/kit`](../kit). Node.js 26 or newer, or any modern browser.

## Usage

### The client

`HTTPClient` extends hapic's `Client`, so its options are hapic's (`baseURL`, headers, hooks, transport) and
`get`, `post`, `put`, `delete` stay available for anything not wrapped. Four domain APIs are attached:

| Property | Calls |
|---|---|
| `client.site` | `getItems(useCase)` → `GET <useCase>/sites`, resolves `{ local, others }` |
| `client.query` | `getOne(useCase, id)` → `GET <useCase>/queries/:id`; `getPatientFilter(useCase, id)` → `GET <useCase>/queries/:id/filters/patient` |
| `client.codeSystem` | `getMany()`, `getOne(uri, filter?)` → `GET coding/codesystems?uri=…` |
| `client.valueSet` | `getMany()`, `getOne(uri, version?, filter?)` → `GET coding/valuesets?uri=…` |

Use-case-specific endpoints (MTB summaries, RD HPO filters, …) live in the feature modules, which wrap this
client in their own (`MTBAPIClient`, `RDHTTPClient`).

### APIs bound to a use case

`PreparedQueryAPI` and `ValidationAPI` take the use case once, in the constructor:

```typescript
import { HTTPClient, PreparedQueryAPI, ValidationAPI } from '@dnpm-dip/http-kit';

const client = new HTTPClient({ baseURL: 'https://dnpm-dip.net/api/' });

const preparedQueries = new PreparedQueryAPI({ client, useCase: 'mtb' });
const { entries } = await preparedQueries.getMany();

const validation = new ValidationAPI({ client, useCase: 'rd' });
const infos = await validation.getReportInfo();
```

| API | Methods | Paths |
|---|---|---|
| `PreparedQueryAPI` | `create`, `getOne`, `getMany`, `update`, `delete` | `<useCase>/prepared-queries[/:id]` |
| `ValidationAPI` | `getReportInfo`, `getReport(id)`, `getPatientRecord(id)` | `<useCase>/validation/infos`, `…/report/:id`, `…/patient-record/:id` |

### Errors

The API answers failures with `{ issues: [{ severity: 'error' | 'warning', details }] }`. hapic raises a
`ClientError`; read the issues from it:

```typescript
import { HTTPClient, extractAPIClientErrorIssues } from '@dnpm-dip/http-kit';
import { isClientError } from 'hapic';

const client = new HTTPClient({ baseURL: 'https://dnpm-dip.net/api/' });

try {
    await client.query.getOne('mtb', 'expired-id');
} catch (error) {
    if (isClientError(error)) {
        for (const issue of extractAPIClientErrorIssues(error)) {
            console.warn(issue.severity, issue.details);
        }
    }
}
```

`extractAPIClientErrorIssues` returns `[]` when the response body is not in that shape, so it is safe on
network errors too. `isAPIClientErrorPayload(body)` is the matching type guard.

## Testing

`@dnpm-dip/http-kit/testing` exports a `FakeClient`: a real `HTTPClient` whose hapic transport is an in-memory
one. Requests, headers and error handling run unchanged; only the network is gone.

<p align="center">
    <img src="./assets/fake-client.svg" alt="createFakeClient: the real client over a fake transport. A spec calls a domain API such as client.site.getItems with the use case mtb. The FakeClient is a real HTTPClient whose hapic transport is a MemoryTransport, so no network is used, and the base URL defaults to http://fake.test. Every call is recorded in client.requests with method, URL, params, body and headers. matchRoute then picks a handler: a specific pattern such as GET /mtb/sites first, then the * catch-all, then the fallback that returns an empty collection. Data returned by a handler resolves with status 200; a fakeResponse with an error status goes through the hapic error pipeline and rejects with a client error." width="100%" />
</p>

```typescript
import { createFakeClient, fakeResponse } from '@dnpm-dip/http-kit/testing';
import { isClientError } from 'hapic';
import { expect, it } from 'vitest';

it('reads the sites of a use case', async () => {
    const client = createFakeClient({
        handlers: {
            'GET /mtb/sites': () => ({ local: { code: 'UKT', system: 'dnpm-dip/site' }, others: [] }),
        },
    });

    const sites = await client.site.getItems('mtb');

    expect(sites.local.code).toBe('UKT');
    expect(client.requests[0]?.url).toContain('/mtb/sites');
});

it('surfaces API errors', async () => {
    const client = createFakeClient({
        handlers: {
            'GET /mtb/sites': () => fakeResponse(500, { issues: [{ severity: 'error', details: 'boom' }] }),
        },
    });

    await expect(client.site.getItems('mtb')).rejects.toSatisfy(isClientError);
});
```

| Option / export | Description |
|---|---|
| `handlers` | Map of `'<METHOD> /<path>'` to a handler. `:name` segments are captured into `request.params`. `'*'` is a catch-all |
| `fallback` | Handler for requests no key matches. Default: `() => ({ entries: [], size: 0 })` |
| `baseURL` and other hapic options | Passed through; `baseURL` defaults to `http://fake.test` |
| `client.requests` | Every request in order: `{ method, url, params, body, headers }`. `body` is parsed back from JSON or form data |
| `fakeResponse(status, body?)` | Returns a real `Response`, so a non-2xx status goes through hapic's error path |
| `matchRoute(method, url, handlers)` | The matcher on its own, for custom transports |

## API

| Export | Kind | Purpose |
|---|---|---|
| `HTTPClient`, `IHTTPClient`, `HTTPClientOptions` | class / types | The client and its options (hapic `ClientOptionsInput`) |
| `BaseAPI` | class | Base of every domain API; takes `{ client }` |
| `CodeSystemAPI`, `ValueSetAPI`, `QueryAPI`, `SiteAPI`, `PreparedQueryAPI`, `ValidationAPI` | class | Domain APIs, each with an `I*API` interface |
| `extractAPIClientErrorIssues`, `isAPIClientErrorPayload`, `APIClientErrorIssueSeverity` | function / enum | API error payload helpers |
| `Coding`, `CodingGroup`, `CodeSystem`, `ValueSet`, `Patient`, `PatientFilter`, `QueryBase`, `QuerySummaryDemographics`, `PreparedQuery`, `ValidationReport`, `ConnectionPeer`, `SiteResponse`, … | type | Domain models |
| `QueryRequestMode` (`local`, `federated`, `custom`), `QueryCriteriaOperator` (`or`, `and`), `ConnectionPeerStatus` | enum | Domain constants |
| `isCoding`, `toCoding`, `serializeCoding`, `buildCodingsRecord`, `extractCodeFromCodingsRecord`, `isCodingGroup`, `toCodingGroup`, `isConceptCount`, `isMinMaxRange`, `isDistributionQuantities` | function | Guards and converters for domain values |
| `transformConceptToFormSelectOption`, `transformFormSelectOptionsToCodings` | function | Mapping between codings and form select options |
| `ResourceCollectionResponse`, `ResourceRecordResponse`, `defineResourceCollectionEvents`, `defineResourceRecordEvents` | type / function | Collection and record response shapes and their event names |
| `HGVS_CODE_REGEX` | constant | Global, case-insensitive match of the three-letter amino-acid codes (`Ala`, `Ter`, …) in HGVS protein notation |

`@dnpm-dip/http-kit/testing`: `createFakeClient`, `FakeClient`, `fakeResponse`, `matchRoute` and the types
`FakeClientOptions`, `FakeHandler`, `FakeHandlerMap`, `FakeRequest`.

## Notes

- **`SiteAPI#getItems` is not a collection.** It resolves `{ local, others }`, not `{ entries, size }`. A fake
  handler for it must return that shape too: the fake client returns whatever the handler returns and checks
  nothing against the real contract.
- **Matching ignores the query string.** `'GET /coding/valuesets'` matches `coding/valuesets?uri=…`; assert on
  `client.requests[i].url` to check parameters.
- **A specific pattern always beats `'*'`**, whatever the key order in `handlers`.
- **Use-case strings are not validated.** `client.query.getOne('mtbb', id)` sends `GET mtbb/queries/:id`.
- **No framework imports.** `http-kit` must not import `vue`, `pinia`, `@vuecs/*` or `@authup/client-web-kit`;
  the Authup token is attached by [`@dnpm-dip/vue`](../vue) when it installs the client.

## License

Published under [MIT License](../../LICENSE).
