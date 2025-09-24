# Utils-JS
[![version](https://img.shields.io/npm/v/@carry0987/utils.svg)](https://www.npmjs.com/package/@carry0987/utils)
![CI](https://github.com/carry0987/Utils-JS/actions/workflows/CI.yml/badge.svg)  
A library for using common tools and alias methods

## Installation
```bash
pnpm add @carry0987/utils -D
```

## Usage

### Importing Entire Modules
You can import the entire set of utilities if you prefer, like this:

```javascript
import { storageUtils } from '@carry0987/utils';

// Usage
storageUtils.setLocalValue('key', 'value');
const value = storageUtils.getLocalValue('key');
```

### Importing Specific Functions (Tree Shaking)
To help with optimizing your bundle size, you can import only the functions you need from `@carry0987/utils`. This helps to reduce the size of your final bundle because unused code will not be included if your bundler supports tree shaking.

```javascript
// Import specific utilities
import { setLocalValue, getLocalValue, removeLocalValue } from '@carry0987/utils';

// Usage
setLocalValue('key', 'value');
const value = getLocalValue('key');
removeLocalValue('key');
```

By using specific imports, you can take advantage of tree shaking in bundlers like Webpack or Rollup, which can statically analyze the imports and remove unused code.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
