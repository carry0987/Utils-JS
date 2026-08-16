---
sidebar_position: 4
---

# Universal Utilities

These APIs are available from `@carry0987/utils` and are safe to use in browser code, Node.js scripts, and SSR-oriented modules unless otherwise noted.

## Common value helpers

The `commonUtils` namespace and direct exports provide the same functions.

### Type and shape checks

- `isDefined(value)` narrows away `null` and `undefined`.
- `isObject(value)` accepts plain objects and rejects arrays.
- `isFunction(value)`, `isString(value)`, `isNumber(value)`, `isBoolean(value)`, and `isArray(value)` provide lightweight runtime checks.
- `isEmpty(value)` treats empty strings, empty arrays, empty objects, `null`, and `undefined` as empty, but keeps `0` as non-empty.

### Cloning and merging

- `shallowClone(value)` clones arrays and objects while preserving object prototypes.
- `deepClone(value)` recursively clones nested arrays and objects.
- `shallowMerge(target, ...sources)` replaces top-level keys.
- `deepMerge(target, ...sources)` recursively merges nested objects and arrays.
- `shallowEqual(a, b)` compares top-level keys by reference/value.
- `deepEqual(a, b)` recursively compares nested structures, arrays, maps, sets, and dates.

Example:

```ts
import { deepClone, deepEqual, deepMerge, shallowMerge } from '@carry0987/utils';

const original = { filters: { status: 'draft' }, tags: ['docs'] };
const copied = deepClone(original);
const merged = deepMerge({ page: 1 }, { filters: { status: 'published' } });
const flat = shallowMerge({ page: 1, sort: 'asc' }, { sort: 'desc' });

console.log(deepEqual(original, copied));
console.log(merged, flat);
```

## IDs and random values

- `generateRandom(length = 8)` returns a lowercase alphanumeric string.
- `generateUUID()` returns a UUID v4-style string.

## URL helpers

Utils-JS includes helpers for both search parameters and hash fragments.

### Reading values

- `getUrlParam(name, url?)` reads a search parameter and ignores hash values.
- `getHashParam(name?, url?)` reads a hash parameter, or returns the plain hash fragment when called without a key.
- `isValidURL(url)` validates whether the string can be parsed by the `URL` constructor.

### Writing values

- `setUrlParam(url, params, overwrite = true)` updates query string values.
- `setHashParam(url, params, overwrite = true)` updates hash parameters or replaces the hash with a plain string.
- Both setters support an object form with `ignore` segments so preserved routing fragments or custom tokens are not overwritten.

Example:

```ts
import { getHashParam, getUrlParam, setHashParam, setUrlParam } from '@carry0987/utils';

const searchUrl = setUrlParam('https://example.com/posts?page=1', {
  page: 2,
  sort: 'recent',
});

const hashUrl = setHashParam(
  {
    url: 'https://example.com/#/route&tab=overview',
    ignore: '/route',
  },
  { tab: 'api', panel: 'examples' }
);

console.log(getUrlParam('page', searchUrl));
console.log(getHashParam('tab', hashUrl));
```

## Request helpers

`fetchUtils` wraps the Fetch API with a small callback-friendly layer.

### `doFetch(options)`

Returns the raw `Response` and optionally runs lifecycle callbacks:

- `beforeSend()` before executing the request
- `success(data)` after a successful response
- `error(err)` if the request fails or returns a non-OK status

For `GET` requests, object bodies are converted into URL parameters. For `POST`, `PUT`, and `DELETE`, object bodies are JSON-stringified unless a `FormData` instance is provided.

### `sendData(options)`

Builds on `doFetch()` and returns parsed response data directly.

- JSON responses are parsed into objects.
- Non-JSON responses are returned as plain text.
- Empty success responses return `null`.

### `sendFormData(options)` and aliases

- `sendFormData()` returns `true` on success and `false` on failure.
- `fetchData` is an alias of `sendData`.
- `sendForm` is an alias of `sendFormData`.

Example:

```ts
import { doFetch, sendData, sendFormData } from '@carry0987/utils';

await doFetch({
  url: 'https://example.com/api/ping',
  success(data) {
    console.log('Ping result:', data);
  },
});

const created = await sendData<{ message: string }>({
  url: 'https://example.com/api/posts',
  method: 'POST',
  data: { title: 'Hello', published: true },
});

const uploaded = await sendFormData({
  url: 'https://example.com/api/upload',
  data: { file: new File(['hello'], 'hello.txt') },
});
```

## FormData helpers

The `formUtils` module is useful when requests need nested form encoding.

- `appendFormData({ data, parentKey }, formData?)` appends nested values into an existing `FormData` instance.
- `encodeFormData(data)` converts objects, files, blobs, or an existing `FormData` instance into a `FormData` payload.
- `decodeFormData(formData)` converts a `FormData` instance back into a plain object, combining repeated keys into arrays.
- `formDataToURLParams(formData)` converts `FormData` fields into a plain parameter object.
- `bodyToURLParams(body)` converts `FormData` or plain objects into URL parameter objects, serializing complex values to JSON strings.

Example:

```ts
import { bodyToURLParams, decodeFormData, encodeFormData } from '@carry0987/utils';

const formData = encodeFormData({
  title: 'Guide',
  metadata: { category: 'docs', priority: 1 },
});

const restored = decodeFormData(formData);
const params = bodyToURLParams({ filter: { status: 'published' }, page: 2 });

console.log(restored, params);
```

## Execution helpers

- `throttle(fn, wait, options)` limits how often a function can run.
- `debounce(fn, wait, options)` delays execution until calls settle and returns a `Promise` for the final result.

`debounce()` resolves all pending calls with the final invocation result, which makes it useful for autosave and search suggestion flows.

Example:

```ts
import { debounce, throttle } from '@carry0987/utils';

const logScroll = throttle(() => {
  console.log('scroll');
}, 100, { trailing: true });

const saveDraft = debounce(async (value: string) => {
  return `saved:${value}`;
}, 200, { maxWait: 1000 });
```

## Error helpers

- `reportError(...args)` forwards values to `console.error`.
- `throwError(message)` throws a new `Error`.
- `assertNever(value, message?)` is useful for exhaustive switch handling.

## Version export

`version` is exported from both runtime entrypoints. It is replaced at build time and can be used for diagnostics or support metadata.
