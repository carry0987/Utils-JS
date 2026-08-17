# Utils-JS
[![version](https://img.shields.io/npm/v/@carry0987/utils.svg)](https://www.npmjs.com/package/@carry0987/utils)
![CI](https://github.com/carry0987/Utils-JS/actions/workflows/ci.yml/badge.svg)  
A utility library for common browser and universal helpers.

## Installation
```bash
pnpm add @carry0987/utils -D
```

## Documentation
Full documentation is available on GitHub Pages:

[https://carry0987.github.io/Utils-JS/](https://carry0987.github.io/Utils-JS/)

## Quick Start
```javascript
import { generateUUID, getUrlParam } from '@carry0987/utils';
import { storageUtils, injectStylesheet } from '@carry0987/utils/browser';

const uuid = generateUUID();
const foo = getUrlParam('foo');
storageUtils.setLocalValue('key', 'value');
injectStylesheet('/styles/app.css');
```

Use `@carry0987/utils` for universal-safe helpers and `@carry0987/utils/browser` for DOM, storage, event, and stylesheet utilities.

## Type Imports
```typescript
import type { CookieOptions, FetchOptions, URLParams } from '@carry0987/utils/types';

const query: URLParams = { page: 1, search: 'utils' };

const requestOptions: FetchOptions = {
	url: '/api/items',
	method: 'GET'
};

const cookieOptions: CookieOptions = {
	path: '/',
	sameSite: 'Lax'
};
```

Import public library types from `@carry0987/utils/types`. The package no longer exposes a separate `interfaces` entrypoint.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
