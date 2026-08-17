---
sidebar_position: 1
---

# Utils-JS

Utils-JS is a compact utility library that separates universal helpers from browser-only helpers.

The package is published as `@carry0987/utils` and is designed for projects that need a predictable set of helper functions without mixing DOM code into SSR-safe code paths.

## Why this package exists

- Use the root entrypoint for utilities that are safe in Node.js, SSR, and browser runtimes.
- Use the browser entrypoint for DOM, event, storage, and stylesheet helpers.
- Import full namespaces or individual functions depending on your bundling strategy.

## What you get

- Value helpers such as `isEmpty`, `deepMerge`, `deepEqual`, `generateUUID`, and URL/hash parameter helpers.
- Request helpers such as `doFetch`, `sendData`, and `sendFormData`.
- FormData conversion helpers for nested objects and uploads.
- Browser-only helpers for storage, cookies, DOM traversal, event dispatching, and runtime stylesheet injection.

## Runtime model

The most important design choice in Utils-JS is the split between entrypoints:

```ts
import { generateUUID, deepMerge } from '@carry0987/utils';
import { storageUtils, injectStylesheet } from '@carry0987/utils/browser';
```

- `@carry0987/utils` stays focused on universal-safe helpers.
- `@carry0987/utils/browser` adds browser APIs on top of the universal set.
- The browser entrypoint still re-exports the universal helpers, so browser bundles can import from a single place when needed.

## Documentation map

- [Getting Started](./getting-started.md) covers installation, import patterns, and first examples.
- [Entrypoints](./entrypoints.md) explains when to use each package path.
- [Universal Utilities](./universal-utilities.md) covers SSR-safe helpers.
- [Browser Utilities](./browser-utilities.md) covers DOM, events, storage, and stylesheet helpers.

## Versioning note

Version `4.x` removed the old server-specific entrypoint and consolidates published declaration access under `@carry0987/utils/types`. If you are migrating older code, move universal helpers to `@carry0987/utils`, browser-only calls to `@carry0987/utils/browser`, and type-only imports to `@carry0987/utils/types`.

