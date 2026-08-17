---
sidebar_position: 2
---

# Getting Started

## Installation

Install the package with your preferred package manager:

```bash
pnpm add @carry0987/utils
```

For Node.js-based workflows, the published package currently targets Node.js 22 or newer.

## Choose the right entrypoint

Use the root entrypoint when your code must remain safe in SSR, Node.js, or mixed runtimes:

```ts
import { deepMerge, generateUUID, sendData } from '@carry0987/utils';
```

Use the browser entrypoint when you need DOM, storage, events, or stylesheet utilities:

```ts
import { getElem, storageUtils, dispatchEvent } from '@carry0987/utils/browser';
```

## Import styles

Utils-JS supports both namespace imports and direct function imports.

### Namespace imports

```ts
import { commonUtils, fetchUtils } from '@carry0987/utils';
import { storageUtils, domUtils } from '@carry0987/utils/browser';

const id = commonUtils.generateUUID();
const node = domUtils.getElem('#app');
storageUtils.setLocalValue('session-id', id);
```

### Direct imports

```ts
import { generateUUID, sendData } from '@carry0987/utils';
import { getLocalValue, setLocalValue } from '@carry0987/utils/browser';

const requestId = generateUUID();
setLocalValue('request-id', requestId);
const savedId = getLocalValue<string>('request-id');
```

Direct imports are the best default when you want modern bundlers to tree-shake unused helpers.

In practice, this means bundlers such as Rollup, Vite, Webpack, or esbuild can keep the utilities you actually reference and drop the rest from the final bundle.

Prefer direct imports when:

- you only need a small number of helpers in a component, route, or feature module
- you care about keeping browser bundles lean
- you want the import list itself to document exactly which utilities a file depends on

Namespace imports are still useful when a module genuinely uses a larger group of related helpers, but they are less explicit as a default documentation pattern.

## First universal example

```ts
import { deepMerge, getUrlParam, sendData } from '@carry0987/utils';

const payload = deepMerge(
  { page: 1, filters: { status: 'draft' } },
  { filters: { status: 'published' } }
);

const currentPage = getUrlParam('page', 'https://example.com/posts?page=2');

const result = await sendData<{ message: string }>({
  url: 'https://example.com/api/posts',
  data: payload,
});
```

## First browser example

```ts
import {
  createElem,
  dispatchEvent,
  getElem,
  injectStylesheet,
  setLocalValue,
} from '@carry0987/utils/browser';

injectStylesheet({
  '.utils-card': {
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: '#f3f6fb',
  },
});

const card = createElem('div', { class: 'utils-card' }, 'Hello from Utils-JS');
document.body.appendChild(card);

setLocalValue('last-card-text', card.textContent);
dispatchEvent('card:mounted', card, { mounted: true });

const mountedCard = getElem('.utils-card');
console.log(mountedCard?.textContent);
```

## Type-only entrypoint

The package also exposes a type declaration entrypoint:

```ts
import type {} from '@carry0987/utils/types';
```

This path is useful when you want to reference the library's published declaration structure explicitly.

## Next steps

Read [Entrypoints](./entrypoints.md) if you are integrating the package into an SSR app, or jump to [Browser Utilities](./browser-utilities.md) if you are building interactive client-side features.
