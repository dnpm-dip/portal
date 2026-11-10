<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/vue</h1>

<p align="center">
    <b>Vue components, composables, stores and services for DNPM DIP.</b><br>
    The HTTP client wired to the Authup session, query filter and session stores, and the components<br>
    the MTB and RD modules share, from codings and patients to validation reports and Kaplan-Meier charts.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/vue"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fvue%2Fpackage.json&label=version" alt="version" /></a>
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

## Why @dnpm-dip/vue?

The MTB and RD modules show the same kinds of things: a query with filters, a result summary, a list of
matching patients, a validation report. They also need the same plumbing: an API client that carries the
signed-in user's token, a filter state that survives navigation, a warning before a query expires.

| Concern | Built per module | With @dnpm-dip/vue |
|---|---|---|
| **Authenticated API calls** | Each module creates a client and attaches the token | `install()` provides one `HTTPClient` with the Authup token hook; modules wrap it |
| **Query lifetime** | Each query page tracks `expiresAfter` | The `querySession` store fires `SESSION_EXPIRING` 5 minutes before expiry and `SESSION_EXPIRED` at it |
| **Filters** | Local component state, lost on reload | The `queryFilter` store plus `buildQueryFiltersURLRecord` keep filters in the URL |
| **Shared views** | Two copies drifting apart | `DQueryFilterBox`, `DQuerySummaryDemographics`, `DValidations`, `DPatient`, `DChartLineKM`, … |
| **API error toasts** | Parse `{ issues }` in every `catch` | `useToast().showError(error)` shows one toast per issue, with its severity |
| **Component tests** | Rebuild the plugin chain in every spec | `mountComponent` from `@dnpm-dip/vue/testing`, backed by a fake client |

## Installation

```bash
npm install @dnpm-dip/vue --save
```

ESM only, with type declarations. Peer dependencies: `vue` 3.5, `pinia` 4, `@authup/client-web-kit` and
`@authup/core-http-kit` (1.0.0-beta.74), the `@vuecs/*` component packages, `@ilingo/*`, `validup` and
`@validup/*`, `zod` 4, `chart.js` with `vue-chartjs`, and `@nuxt/kit`. In this repository the portal brings them
all; a separate app has to install them. Styles ship as `@dnpm-dip/vue/index.css`.

## Usage

### Install

<p align="center">
    <img src="./assets/install-chain.svg" alt="What install() sets up, and what has to come first. Install order: pinia, then @vuecs/core, then @authup/client-web-kit, then install(app, options) from @dnpm-dip/vue, then the module clients such as MTBAPIClient. install() registers DKVTable as the only global component. It installs the HTTP client: if one is already provided it is kept, otherwise it creates an HTTPClient for the base URL and attaches the Authup token hook. It creates the query event bus, which fires SESSION_EXPIRING five minutes before a query expires, and installs the queryFilter and querySession Pinia stores, which share that bus." width="100%" />
</p>

```typescript
import { install } from '@dnpm-dip/vue';
import type { App } from 'vue';

declare const app: App;

install(app, { baseURL: 'https://dnpm-dip.net/api/' });
```

The portal does this in its `dnpm:kit` plugin (`packages/portal/plugins/kit.ts`), after the Authup plugin.

| Option | Type | Description |
|---|---|---|
| `baseURL` | `string` | API base URL for the `HTTPClient` that `install` creates |
| `httpClient` | `IHTTPClient` | Use this client instead of creating one. The Authup token hook is still attached |

- **`@authup/client-web-kit` must be installed first.** `install` asks it for the token hook and throws otherwise.
- **The first client wins.** If a client is already provided on the app, `install` keeps it and ignores `baseURL`
  and `httpClient`.
- `install` registers one global component, `DKVTable`. Import every other component where you use it.

### The API client in components

```typescript
import { injectHTTPClient } from '@dnpm-dip/vue';

const client = injectHTTPClient();
const sites = await client.site.getItems('mtb');
```

Call `injectHTTPClient()` inside `setup()` (or pass the `app`). It throws `The APIClient is not set.` when nothing
was installed. Feature modules wrap the base client and provide their own under a separate symbol: the MTB module
provides an `MTBAPIClient` from its `plugins/api.ts`.

### Query session and filters

```typescript
import { QueryEventBusEventName, injectQueryEventBus, useQuerySessionStore } from '@dnpm-dip/vue';

const session = useQuerySessionStore();
const bus = injectQueryEventBus();

bus.on(QueryEventBusEventName.SESSION_EXPIRED, () => {
    console.warn('The query has expired. Submit it again.');
});
```

| Event | When |
|---|---|
| `SESSION_UPDATED` | Summary components (`DQuerySummaryGrouped`, MTB summaries) re-render on it. Nothing in this repository emits it today: emit it yourself after changing a query's criteria |
| `SESSION_EXPIRING` | 5 minutes before the tracked query's `expiresAfter`. The portal refetches the query and tracks it again |
| `SESSION_EXPIRED` | At `expiresAfter` |
| `SESSION_REFRESH_FAILED` | The portal could not refetch an expiring query |
| `FILTER_UPDATED`, `FILTERS_COMMITED` | A filter value changed, or the filter set was applied |

`session.track(query)` starts both timers and `session.unTrack()` clears them; a new `track` replaces the
previous query.

### Toasts

```typescript
import { useToast } from '@dnpm-dip/vue';

const toast = useToast();

toast.show('Abfrage gespeichert', { variant: 'success' });

try {
    await save();
} catch (error) {
    toast.showError(error as Error);
}

declare function save(): Promise<void>;
```

`showError` shows one toast per API issue (`warning` issues as warnings, everything else as errors) and falls back
to `error.message`. Toasts only appear where a `<VCToastProvider>`/`<VCToaster>` host is mounted; the portal
mounts it in its default layout. Without one, nothing is shown and nothing fails.

### Page meta

Pages declare what they need through `PageMetaKey`; the portal's middleware and navigation read it:

```typescript
import { PageMetaKey } from '@dnpm-dip/vue';

const meta = {
    [PageMetaKey.NAVIGATION_TOP_ID]: 'mtb',
    [PageMetaKey.NAVIGATION_SIDE_ID]: 'mtb-search',
    [PageMetaKey.REQUIRED_PERMISSIONS]: ['mtb_query_submit'],
};
```

`REQUIRED_LOGGED_IN` and `REQUIRED_LOGGED_OUT` gate a page on the session.

## Testing

`@dnpm-dip/vue/testing` re-exports everything from `@dnpm-dip/http-kit/testing` and adds `mountComponent`, which
mounts a component with the same plugin chain as the diagram above, backed by a fake HTTP client:

```typescript
import { mountComponent } from '@dnpm-dip/vue/testing';
import { DSitePicker } from '@dnpm-dip/vue';
import { expect, it } from 'vitest';

it('loads the sites of the use case', async () => {
    const { client } = mountComponent(
        DSitePicker,
        { useCase: 'mtb' },
        { 'GET /mtb/sites': () => ({ local: { code: 'UKT' }, others: [] }) },
    );

    await new Promise((resolve) => setTimeout(resolve));

    expect(client.requests[0]?.url).toContain('/mtb/sites');
});
```

`mountComponent(component, props?, handlers?, options?)` returns `{ wrapper, client, pinia }`. `options.onApp(app,
client)` runs after the base client is provided and before mounting; feature modules use it to provide their own
client on top. `<VCIcon>` is stubbed, so no icon is fetched over the network. `@vue/test-utils` is an optional
peer dependency, needed only for this entry point.

## API

| Export | Kind | Purpose |
|---|---|---|
| `install`, `InstallOptions` | function / type | Sets up client, event bus and stores (see above) |
| `injectHTTPClient`, `provideHTTPClient`, `isHTTPIClientInjected`, `installHTTPClient`, `setupBaseHTTPClient`, `APIClientSymbol` | function / symbol | HTTP client dependency injection |
| `provide`, `inject` | function | Provide/inject that work with an `app` or inside `setup()` |
| `useQueryFilterStore`, `createQueryFilterStore`, `installQueryFilterStore`, `buildQueryFilterURLValue`, `buildQueryFiltersURLRecord`, `QueryFilterURLKey` | store / function | Query filter state and its URL form |
| `useQuerySessionStore`, `createQuerySessionStore`, `installQuerySessionStore` | store | The tracked query and its expiry timers |
| `createQueryEventBus`, `injectQueryEventBus`, `provideQueryEventBus`, `QueryEventBusEventName` | service | Query events (see above) |
| `useToast` | composable | `show` and `showError` over the vuecs toast queue |
| `createResourceCollectionManager`, `createResourceRecordManager` | function | Load, page and refresh a collection or a single record |
| `PageMetaKey`, `PageNavigationTopID`, `ModuleType`, `ModuleMeta`, `NavigationItemMeta` | enum / type | Page meta and module registration shapes |
| `renderError`, `hasNormalizedSlot`, `normalizeSlot`, `extendRefRecord` | function | Render and ref helpers |

**Components** (36, all prefixed `D`):

| Group | Components |
|---|---|
| Query | `DQueryFilterBox`, `DQueryFilterContainer`, `DQueryPatientFilters`, `DQueryInfoBox`, `DQuerySummaryDemographics`, `DQuerySummaryGrouped`, `DQuerySummaryNested`, `DSitePicker` |
| Prepared queries | `DPreparedQueries`, `DPreparedQuery`, `DPreparedQueryContainer` |
| Domain values | `DPatient`, `DCodeSystem`, `DValueSet`, `DCodingText`, `DCodingCommaList`, `DConnectionPeerCard` |
| Validation | `DValidations`, `DValidationReport`, `DValidationReportCard` |
| Charts and key/value data | `DChart`, `DChartLineKM`, `DKVChart`, `DKVChartTableSwitch`, `DKVTable`, `DKVTableEntryKey` |
| Layout and utility | `DFact`, `DTags`, `DCommaList`, `DExpandableContent`, `DFormTabGroups`, `DLogicalOperatorSwitch`, `DCollectionTransform`, `DLoadingModal`, `DAlertError`, `DAPIClientError` |

## Notes

- **Overlay hosts are required and fail silently.** `useToast()` only queues; without a mounted toast host the
  toast never shows. Confirm dialogs from `@authup/client-web-kit` need `<VCAlertDialogProvider>` the same way.
- **Under `mountComponent`, globally registered `VC*` components do not resolve.** Only `DKVTable` is global;
  `VCTable` rows, checkboxes and pagination render as unknown elements. Assert on emitted events, `client.requests`
  and the component's own markup instead.
- **Types from Authup are imported, never re-exported.** Import them from `@authup/client-web-kit` directly.

## License

Published under [MIT License](../../LICENSE).
