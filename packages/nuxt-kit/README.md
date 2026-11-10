<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/nuxt-kit</h1>

<p align="center">
    <b>Kit for DNPM:DIP apps and packages.</b><br>
    Gives a Nuxt module its own file-based pages under a base URL, with the same bracket syntax<br>
    as an app's <code>pages/</code> directory, so a use case ships its routes inside its package.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/nuxt-kit"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fnuxt-kit%2Fpackage.json&label=version" alt="version" /></a>
    <a href="https://github.com/dnpm-dip/portal/actions/workflows/main.yml"><img src="https://github.com/dnpm-dip/portal/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
</p>

<p align="center">
    <a href="#installation"><b>Installation</b></a>
    ·
    <a href="#usage">Usage</a>
    ·
    <a href="#api">API</a>
    ·
    <a href="#notes">Notes</a>
</p>

---

## Why @dnpm-dip/nuxt-kit?

Nuxt builds routes from the app's own `pages/` directory. A module that brings its own pages, like the MTB, RD
and admin modules of the portal, has to declare each route by hand with `extendPages`, including nested
children, parameters and names, and keep that list in step with its files.

| Concern | With `extendPages` by hand | With `registerPages` |
|---|---|---|
| **Declaring routes** | One object per page, `path`, `file`, `children` | One call; the files are the routes |
| **Base URL** | Prefix every path yourself | `baseURL: '/mtb/'` prefixes all of them |
| **Nesting** | Build the `children` tree manually | `query/[id].vue` plus `query/[id]/…` nest like in an app |
| **Parameters** | Translate `[id]` to `:id` yourself | `[id]`, `[[id]]`, `[...slug]` and `index` follow Nuxt |

```typescript
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { registerPages } from '@dnpm-dip/nuxt-kit';

export default defineNuxtModule({
    meta: { name: '@dnpm-dip/mtb', configKey: 'mtb' },
    async setup() {
        const resolver = createResolver(import.meta.url);

        await registerPages({ baseURL: '/mtb/', rootDir: import.meta.url });

        addPlugin(resolver.resolve('./runtime/plugins/api'));
    },
});
```

<p align="center">
    <img src="./assets/page-routes.svg" alt="registerPages from @dnpm-dip/nuxt-kit reads the files under packages/mtb/src/runtime/pages and adds routes below /mtb in the pages:extend hook. index.vue becomes /mtb, validation/index.vue becomes /mtb/validation, query/[id].vue becomes /mtb/query/:id(), and files in the query/[id] folder become its child routes, for example summary/medication and patients/:patientId()/plans. Brackets follow Nuxt: [id] is a parameter, [[id]] an optional one, [...slug] a catch-all, and index maps to the parent path." width="100%" />
</p>

## Installation

```bash
npm install @dnpm-dip/nuxt-kit --save
```

ESM only, with type declarations. Depends on `@nuxt/kit`, `@nuxt/schema` and `ufo`; use it from a Nuxt module's
`setup()`, at build time. Node.js 26 or newer.

## Usage

### registerPages

`registerPages(ctx)` must run inside a Nuxt module's `setup()`, because it calls `useNuxt()`.

| Option | Type | Default | Description |
|---|---|---|---|
| `baseURL` | `string` | — | Prefix for every route, e.g. `'/mtb/'`. A trailing `/` is removed |
| `rootDir` | `string \| URL` | the location of `@dnpm-dip/nuxt-kit` itself | Directory or file URL the pages are resolved from. Pass `import.meta.url` of your module file |

It then:

1. resolves `<rootDir>/runtime/pages`, so a module at `src/module.ts` keeps its pages in `src/runtime/pages`;
2. collects every `.vue` and `.ts` file below it;
3. turns them into Nuxt routes, prefixed with `baseURL`;
4. appends them in the `pages:extend` hook.

### Files to routes

| File (below `runtime/pages`) | Route |
|---|---|
| `index.vue` | `/mtb` |
| `validation/index.vue` | `/mtb/validation` |
| `query/[id].vue` | `/mtb/query/:id()`, a parent that renders `<NuxtPage>` |
| `query/[id]/index/summary/medication.vue` | child route `summary/medication` |
| `query/[id]/patients/[patientId]/plans.vue` | child route `patients/:patientId()/plans` |
| `x/[[opt]].vue` | `/mtb/x/:opt?` |
| `x/[...slug].vue` | `/mtb/x/:slug(.*)*` |

Route names are built from the path segments with `-`, for example `-mtb-query-id-index-summary-medication`, and
`-index` suffixes are dropped.

### generateNuxtPages

The route builder on its own, for when you already have the file list:

```typescript
import { generateNuxtPages } from '@dnpm-dip/nuxt-kit';

const pages = await generateNuxtPages({
    directory: '/abs/path/to/runtime/pages',
    files: ['/abs/path/to/runtime/pages/index.vue'],
    prefix: '/mtb',
});
```

`files` are absolute paths inside `directory`; `prefix` is used as given, without trimming.

## API

| Export | Kind | Purpose |
|---|---|---|
| `registerPages(ctx)` | async function | Registers a module's `runtime/pages` under `ctx.baseURL` (see above) |
| `generateNuxtPages({ directory, files, prefix })` | async function | Builds the `NuxtPage[]` tree without registering it |
| `escapeStringRegexp(input)` | function | Escapes a string for use inside a `RegExp` |

## Notes

- **Pages must be in `runtime/pages` next to the module file.** The directory name is fixed.
- **Route names start with `-`.** They are derived from the prefix, so `/mtb` yields `-mtb…`. Navigate by path,
  or look the name up instead of writing it by hand.
- **The parser is adapted from Nuxt (MIT)** and knows four segment kinds: static, `[dynamic]`, `[[optional]]` and
  `[...catchall]`. Nuxt's route groups (`(group)/`) have no special meaning here: the parentheses stay in the path.
- **Registration only.** Menu entries and permissions are not part of this package; the portal's modules
  register those through the `register` runtime hook.

## License

Published under [MIT License](../../LICENSE).
