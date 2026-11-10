<p align="center">
    <img src="./assets/logo.svg" alt="DNPM:DIP logo: a double helix with a graphite and a coral strand" width="96" height="96" />
</p>

<h1 align="center">@dnpm-dip/kit</h1>

<p align="center">
    <b>Framework-free utilities for DNPM:DIP apps and packages.</b><br>
    URL query serialization, string templates, debouncing, cloning and the colour maths behind the charts,<br>
    with no Vue, Pinia or Nuxt import, so every other package can depend on it.
</p>

<p align="center">
    <a href="https://github.com/dnpm-dip/portal/tree/master/packages/kit"><img src="https://img.shields.io/github/package-json/v/dnpm-dip/portal?filename=packages%2Fkit%2Fpackage.json&label=version" alt="version" /></a>
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

## Why @dnpm-dip/kit?

`http-kit`, `vue` and the feature modules each need the same small helpers. Without a shared home they get
copied, and copies drift. `kit` is the bottom layer of the [portal monorepo](../../README.md#packages): it has
one dependency (`smob`) and is allowed to import nothing framework-specific, so the HTTP layer can use it as
freely as a Vue component can.

| Concern | Without it | With @dnpm-dip/kit |
|---|---|---|
| **Query strings with nested keys** | Hand-built `filter[name]=…` strings, forgotten encoding | `serializeURLQueryRecord({ filter: { name: 'x' } })` |
| **Colour scales for charts** | Ad-hoc interpolation per chart | `getColorInRange` between two colours, `generateRandomColorTuple` |
| **Placeholders in copy** | String concatenation | `template('Hallo {{name}}', { name })` |
| **Type guards** | `typeof x === 'object' && x !== null` everywhere | `isObject`, `hasOwnProperty` narrowing the type |

## Installation

```bash
npm install @dnpm-dip/kit --save
```

ESM only, with type declarations. Node.js 26 or newer, or any modern browser.

## Usage

### URL query records

```typescript
import { serializeURLQueryRecord } from '@dnpm-dip/kit';

serializeURLQueryRecord({
    page: 2,
    codes: ['C34.1', 'C50.9'],
    filter: { site: 'UKT', gender: ['male', 'female'] },
});
// page=2&codes=C34.1&codes=C50.9&filter[site]=UKT&filter[gender]=male&filter[gender]=female
```

- Arrays repeat the key once per item.
- One level of nesting becomes `parent[child]`. Deeper objects are not supported.
- Values are passed through `encodeURIComponent`; keys are written as given.
- `undefined` values are skipped.

The MTB module builds its query-filter URLs with it (`packages/mtb/src/runtime/domains/query/api.ts`).

### Templates

```typescript
import { template } from '@dnpm-dip/kit';

template('{{count}} Patienten an {{site}}', { count: 12, site: 'UKT' });
// "12 Patienten an UKT"
```

A placeholder whose key is missing from `data` stays in the string unchanged. Pass a third argument to use a
different placeholder pattern; the first capture group is the key.

### Colours

```typescript
import { getColorInRange, rgbToHex } from '@dnpm-dip/kit';

const rgb = getColorInRange({
    start: '#C7B1BD',
    end: '#F65552',
    rangeMax: 100,
    rangeValue: 25,
});

rgbToHex(rgb);
```

`getColorInRange` interpolates each channel linearly between `start` and `end` (hex strings or `{ r, g, b }`),
for a value between `rangeMin` (default `0`) and `rangeMax`.

### Timing and copying

```typescript
import { clone, debounce } from '@dnpm-dip/kit';

const search = debounce((term: string) => console.log(term), 300);
search('BRAF');

const copy = clone({ criteria: { diagnoses: [] } });
```

## API

| Export | Kind | Purpose |
|---|---|---|
| `serializeURLQueryRecord(record)` | function | Turns a `URLQueryRecord` into a query string (see above) |
| `template(str, data, regex?)` | function | Replaces `{{key}}` placeholders from `data` |
| `debounce(fn, ms = 0)` | function | Returns a function that calls `fn` once calls have stopped for `ms` milliseconds |
| `clone(input)` | function | Deep copy of arrays and objects that survives circular references (`smob`'s `polyfillClone`) |
| `isObject(input)` | type guard | `true` for non-null, non-array objects |
| `hasOwnProperty(obj, prop)` | type guard | Own-property check that narrows `obj` to include `prop` |
| `getColorInRange({ start, end, rangeMin?, rangeMax, rangeValue })` | function | Linear colour interpolation, returns `RGB` |
| `hexToRgb(hex)` / `rgbToHex(rgb)` | function | Conversion between six-digit hex (`#` optional on input) and `{ r, g, b }`; `hexToRgb` throws a `SyntaxError` on anything else, including `#RGB` shorthand |
| `hslToRgb(hsl)` | function | Converts `{ h, s, l }` with every channel in `0…1` to `RGB` |
| `generateRandomColorTuple(slices = 6)` | function | A dark and a light colour from a random hue section, for gradient pairs |
| `ObjectLiteral`, `URLQueryRecord`, `URlQueryRecordScalarValue`, `RGB`, `HSL` | type | Types used by the functions above |

## Notes

- **No framework imports, ever.** `kit` must not import `vue`, `pinia`, `@vuecs/*`, `@authup/client-web-kit`,
  `vue-chartjs` or `chart.js`; Vue-facing helpers belong in [`@dnpm-dip/vue`](../vue).
- **`debounce` drops the return value.** The wrapper returns `undefined`; only the last call within the window runs.
- **`generateRandomColorTuple` is random.** Two calls give different colours; store the result if a chart must keep its colours between renders.

## License

Published under [MIT License](../../LICENSE).
