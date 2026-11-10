<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/rd</h1>

<p align="center">
    <b>Rare Diseases (RD) module for the DNPM:DIP Portal.</b><br>
    Search rare-disease cases by diagnosis, HPO terms and variants across all sites,<br>
    then read the summary and full patient records of the matches.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/rd"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Frd%2Fpackage.json&label=version" alt="version" /></a>
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
it from source (`'../rd/src/module'` in `packages/portal/nuxt.config.ts`).

## What it adds

A query starts on the search page and is the handle for everything after it:

<p align="center">
    <img src="./assets/query-flow.svg" alt="On /rd the Suche page (RSearchForm, needs rd_query_submit) posts the criteria and a mode (local for the own site or federated for all sites) to rd/queries and gets a query with an id and expiresAfter. Changing the criteria later sends PUT rd/queries/:id. The query pages under /rd/query/:id() then read everything below rd/queries/:id: the diagnosis and HPO filter options, the demographics and diagnostics summaries, and patient-matches and patient-record/:pid. The query session store tracks the query and fires SESSION_EXPIRING five minutes before it expires; the portal plugin then fetches the query again and tracks it anew." width="100%" />
</p>

- **Search** (`RSearchForm`): diagnoses, HPO terms and variants (small, structural and copy-number variants).
  Mode **local** (own site) or **federated** (all sites).
- **Summary**: demographics and diagnostics, filterable by diagnosis category and HPO term.
- **Patients**: the matches, then a patient record with its diagnostics.
- **Validation** (*Validierungsmeldungen*): data-quality reports of the local site's patient records.
- **Prepared queries**: save a search and run it again.

The module itself is three calls in `src/module.ts`: `registerPages` from
[`@dnpm-dip/nuxt-kit`](../nuxt-kit), a plugin that provides the API client, and a plugin that registers the menu.
See the [root README](../../README.md#why-the-portal) for how those plug into the portal.

## Routes

| Route | Page |
|---|---|
| `/rd` | Search |
| `/rd/validation` | Validation reports |
| `/rd/query/:id()` | Query, with the tabs below |
| `…/info` | Query criteria and metadata |
| `…/summary` | Summary, with `diagnostics` |
| `…/patients` | Matching patients |
| `/rd/query/:id()/patients/:patientId()` | Patient record, with `diagnostics` |

## Permissions

| Permission | Checked by |
|---|---|
| `rd_query_submit` | The *Suche* menu entry and the `/rd` page |
| `rd_validation_infos_read`, `rd_validation_report_read`, `rd_validation_patient_record_read` | The *Validierungsmeldungen* menu entry (any one of the three is enough) |
| `rd_result_summary_read`, `rd_patient_matches_read`, `rd_patient_record_read` | Declared in `PermissionName`; the API enforces them, the UI does not check them |

The menu appears under **RD** in the top bar and requires a signed-in user. Write bare permission names: the
portal accepts the global definition or the one owned by the user's realm.

## API client

`RDHTTPClient` wraps the portal's base `HTTPClient` (which carries the Authup token) and is provided under
`Symbol.for('RDHTTPClient')` by `runtime/plugins/api.ts`:

| Property | Methods | Paths below `API_URL` |
|---|---|---|
| `query` | `submit`, `getOne`, `update` | `POST rd/queries`, `GET`/`PUT rd/queries/:id` |
| | `getDiagnosisFilter`, `getHpoFilter` | `…/:id/filters/diagnosis`, `…/:id/filters/hpo` |
| | `getDemographics`, `getDiagnostics` | `…/:id/demographics`, `…/:id/diagnostics` |
| | `getPatients`, `getPatientRecord` | `…/:id/patient-matches`, `…/:id/patient-record/:pid` |
| `preparedQuery` | `PreparedQueryAPI` for use case `rd` | `rd/prepared-queries` |

Unlike MTB, the RD client has no `validation` property: the validation page renders `DValidations` from
[`@dnpm-dip/vue`](../vue) with `use-case="rd"`, which builds a `ValidationAPI` on the base client.

Components are prefixed `R` (for example `RSearchForm`, `RQueryHPOFilter`, `RQueryDiagnosisFilter`,
`RQueryPatientRecord`, `RVariant`).

## Development

```bash
npm run test --workspace=packages/rd
npm run build --workspace=packages/rd
```

- **The tests are the real check, not the build.** `nuxt-module-build` transpiles each file on its own and exits
  `0` even when an import points at a module that no longer exists.
- Specs import `@dnpm-dip/*` from the sibling `src/` folders, so no build is needed first. They do need
  `.nuxt/tsconfig.json`: run `npx nuxt-module-build prepare` in this package once on a fresh checkout.
- `test/utils` has `createModuleClient(handlers)` and `mountModuleComponent(component, props, handlers)`, mirrored
  from the MTB module.
- Keep [`@dnpm-dip/mtb`](../mtb) in step: `RQuery*` components have `MQuery*` counterparts.

## License

Published under [MIT License](../../LICENSE).
