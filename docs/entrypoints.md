---
sidebar_position: 3
---

# Entrypoints

Utils-JS publishes two runtime entrypoints and one declaration-only subpath.

## `@carry0987/utils`

This is the default universal-safe surface.

Use it for:

- object and value helpers
- URL and hash parameter helpers
- request helpers built on top of `fetch`
- FormData encoding and decoding
- throttling, debouncing, and error helpers

Example:

```ts showLineNumbers
import {
  deepEqual,
  generateRandom,
  getHashParam,
  sendData,
  throttle,
} from '@carry0987/utils';
```

This entrypoint intentionally does not expose browser-only namespaces such as `storageUtils`, `domUtils`, or `eventUtils`.

## `@carry0987/utils/browser`

This entrypoint includes everything from the universal surface and adds browser-only helpers.

Use it for:

- DOM querying and traversal
- event creation and dispatch
- `localStorage`, `sessionStorage`, and cookies
- runtime stylesheet injection

Example:

```ts
import {
  addEventListener,
  getElem,
  removeStylesheet,
  setCookie,
  setStylesheetId,
} from '@carry0987/utils/browser';
```

## SSR guidance

The root entrypoint is the safest default for shared modules in SSR frameworks.

The browser entrypoint should only be imported from code that is expected to run in a browser environment. Several helpers fail softly when browser APIs are unavailable:

- storage helpers return `null` or no-op when storage is not available
- stylesheet helpers no-op when `document.head` is unavailable

Some browser helpers intentionally throw when a DOM is required, for example DOM query and element creation utilities.

## Why the split matters

Tests in this repository verify that the root entrypoint does not expose browser-only namespaces. That keeps SSR-safe imports explicit and reduces accidental coupling to DOM APIs.

## Type subpath

One extra export is available for declaration access:

- `@carry0987/utils/types`

This path is useful when you want to reference published declaration files directly from tooling or advanced type-only integrations. The package no longer publishes a separate `interfaces` subpath.
