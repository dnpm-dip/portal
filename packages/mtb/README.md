<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/mtb</h1>

<p align="center">
    <b>Molecular Tumor Board (MTB) module for the DNPM:DIP Portal.</b><br>
    Search tumor cases by diagnosis, variant and therapy across all sites, then read the summary,<br>
    survival statistics and full patient records of the matches.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/mtb"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fmtb%2Fpackage.json&label=version" alt="version" /></a>
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/main.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
</p>

<p align="center">
    <a href="#what-it-adds"><b>What it adds</b></a>
    ·
    <a href="#routes">Routes</a>
    ·
    <a href="#permissions">Permissions</a>
    ·
    <a href="#api-client">API client</a>
    ·
    <a href="#development">Development</a>
</p>

---

This package is private: it is not published to npm and ships inside the portal's Docker image. The portal loads
it from source (`'../mtb/src/module'` in `packages/portal/nuxt.config.ts`).

## What it adds

A query starts on the search page and is the handle for everything after it:

<p align="center">
    <img src="./assets/query-flow.svg" alt="On /mtb the Suche page (MSearchForm, needs mtb_query_submit) posts the criteria and a mode (local for the own site or federated for all sites) to mtb/queries and gets a query with an id and expiresAfter. Changing the criteria later sends PUT mtb/queries/:id. The query pages under /mtb/query/:id() then read everything below mtb/queries/:id: the filter options for diagnosis, therapy and therapy recommendation; the summary endpoints demographics, tumor-diagnostics, gene-alterations, medication, therapy-responses and survival-statistics; and patient-matches and patient-record/:pid. The query session store tracks the query and fires SESSION_EXPIRING five minutes before it expires; the portal plugin then fetches the query again and tracks it anew." width="100%" />
</p>

- **Search** (`MSearchForm`): tumor entities, tumor morphologies, gene alterations (SNVs, CNVs and fusions, alone
  or in combination), medication with its usage, and therapy responses. Mode **local** (own site) or
  **federated** (all sites).
- **Summary**: demographics, tumor diagnostics, gene alterations and their distributions, medication, therapy
  responses (detailed and coarse) and Kaplan-Meier survival statistics.
- **Patients**: the matches, then a patient record with diagnostics, follow-up, metadata and care plans.
- **Validation** (*Validierungsmeldungen*): data-quality reports of the local site's patient records.
- **Prepared queries**: save a search and run it again.

The module itself is three calls in `src/module.ts`: `registerPages` from
[`@dnpm-dip/nuxt-kit`](../nuxt-kit), a plugin that provides the API client, and a plugin that registers the menu.
See the [root README](../../README.md#why-the-portal) for how those plug into the portal.

## Routes

| Route | Page |
|---|---|
| `/mtb` | Search |
| `/mtb/validation` | Validation reports |
| `/mtb/query/:id()` | Query, with the tabs below |
| `…/info` | Query criteria and metadata |
| `…/summary` | Summary, with `diagnostics`, `gene-alterations`, `medication`, `survival-report`, `therapy-responses` |
| `…/patients` | Matching patients |
| `/mtb/query/:id()/patients/:patientId()` | Patient record, with `diagnostics`, `follow-up`, `metadata`, `plans` |

## Permissions

| Permission | Checked by |
|---|---|
| `mtb_query_submit` | The *Suche* menu entry and the `/mtb` page |
| `mtb_validation_infos_read`, `mtb_validation_report_read`, `mtb_validation_patient_record_read` | The *Validierungsmeldungen* menu entry (any one of the three is enough) |
| `mtb_result_summary_read`, `mtb_patient_matches_read`, `mtb_patient_record_read` | Declared in `PermissionName`; the API enforces them, the UI does not check them |

The menu appears under **MTB** in the top bar and requires a signed-in user. Write bare permission names: the
portal accepts the global definition or the one owned by the user's realm.

## API client

`MTBAPIClient` wraps the portal's base `HTTPClient` (which carries the Authup token) and is provided under
`Symbol.for('MTBHTTPClient')` by `runtime/plugins/api.ts`:

| Property | Methods | Paths below `API_URL` |
|---|---|---|
| `query` | `submit`, `getOne`, `update` | `POST mtb/queries`, `GET`/`PUT mtb/queries/:id` |
| | `getDiagnosisFilter`, `getTherapyImplementedFilter`, `getTherapyRecommendedFilter` | `…/:id/filters/{diagnosis,therapy,therapy-recommendation}` |
| | `getDemographics`, `getTumorDiagnostics`, `getGeneAlterationInfos`, `getGeneAlterationDistributions`, `getMedication`, `getTherapyResponses`, `getCoarseTherapyResponses`, `getKaplanMeierStatistics` | `…/:id/demographics`, `/tumor-diagnostics`, `/gene-alterations`, `/altered-gene-distributions`, `/medication`, `/therapy-responses`, `/coarse-therapy-responses`, `/survival-statistics` |
| | `getPatients`, `getPatientRecord` | `…/:id/patient-matches`, `…/:id/patient-record/:pid` |
| `kaplanMeier` | `getOptions` | `mtb/kaplan-meier/config` |
| `preparedQuery` | `PreparedQueryAPI` for use case `mtb` | `mtb/prepared-queries` |
| `validation` | `ValidationAPI` for use case `mtb` | `mtb/validation/…` |

Components are prefixed `M` (29 of them, for example `MSearchForm`, `MQueryPatientMatches`,
`MQuerySummaryMedication`, `MQueryKaplanMeierStatistic`, `MNGSReportSNV`).

## Development

```bash
npm run test --workspace=packages/mtb
npm run build --workspace=packages/mtb
```

- **The tests are the real check, not the build.** `nuxt-module-build` transpiles each file on its own and exits
  `0` even when an import points at a module that no longer exists.
- Specs import `@dnpm-dip/*` from the sibling `src/` folders, so no build is needed first. They do need
  `.nuxt/tsconfig.json`: run `npx nuxt-module-build prepare` in this package once on a fresh checkout.
- `test/utils` has `createModuleClient(handlers)` for the API client alone and `mountModuleComponent(component,
  props, handlers)` for a mounted component with `MTBAPIClient` provided.
- Keep [`@dnpm-dip/rd`](../rd) in step: `MQuery*` components have `RQuery*` counterparts.

## License

Published under [MIT License](../../LICENSE).
