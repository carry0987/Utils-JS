---
sidebar_position: 5
---

# Browser Utilities

These APIs are available from `@carry0987/utils/browser`.

They include all universal helpers plus browser-specific modules for DOM access, events, storage, cookies, and runtime stylesheet injection.

## Browser-safe vs browser-required

The browser entrypoint contains two kinds of behavior:

- soft runtime guards: some helpers return `null` or no-op when browser globals are missing
- strict DOM helpers: some functions throw when a real `document` is required

This distinction matters in hybrid apps.

### Soft runtime guards

- storage helpers use safe accessors for `localStorage` and `sessionStorage`
- cookie helpers return `null` or no-op when `document` is unavailable
- stylesheet helpers no-op when `document.head` is missing

### Strict DOM requirements

- `getElem()`
- `createElem()`
- `templateToHtml()`
- DOM insertion helpers

These functions expect a real DOM and throw if the runtime cannot provide one.

## Storage utilities

The `storageUtils` namespace provides helpers for local storage, session storage, and cookies.

### Local and session storage

- `setLocalValue(key, value, stringify = true)` stores values in `localStorage`.
- `getLocalValue(key, parseJson = true)` returns parsed JSON when possible, or the raw string when parsing is disabled or fails.
- `removeLocalValue(key)` removes a local storage key.
- `setSessionValue()`, `getSessionValue()`, and `removeSessionValue()` do the same for `sessionStorage`.

If stored data is invalid JSON, the read helpers report the parsing error and return the original string.

Example:

```ts
import { getLocalValue, setLocalValue, setSessionValue } from '@carry0987/utils/browser';

setLocalValue('preferences', { theme: 'light', density: 'compact' });
setSessionValue('csrf-token', 'token-123', false);

const preferences = getLocalValue<{ theme: string; density: string }>('preferences');
const token = getLocalValue('csrf-token', false);
```

### Cookies

- `setCookie(name, value, options?)` writes a cookie with sensible defaults.
- `getCookie(name)` reads a cookie value.
- `removeCookie(name)` expires a cookie immediately.

Default cookie behavior:

- `expires`: 1 day from now
- `path`: `/`
- `secure`: `false`
- `sameSite`: `Lax`

Example:

```ts
import { getCookie, removeCookie, setCookie } from '@carry0987/utils/browser';

setCookie('locale', 'en', {
  secure: true,
  sameSite: 'Strict',
});

console.log(getCookie('locale'));
removeCookie('locale');
```

## DOM utilities

The `domUtils` module focuses on practical querying, creation, insertion, and traversal helpers.

### Query and create

- `getElem(selector)` returns the first matching element.
- `getElem(selector, 'all')` returns all matching elements.
- `getElem(existingElement)` returns the element unchanged.
- `createElem(tagName, attrs, text?)` creates an element and applies attributes.

### Insert nodes

- `insertAfter(referenceNode, newNode)` inserts a node or HTML string after a reference node.
- `insertBefore(referenceNode, newNode)` inserts a node or HTML string before a reference node.

### Class helpers

- `addClass(element, className)`
- `removeClass(element, className)`
- `toggleClass(element, className, force?)`
- `hasClass(element, className)`

### Parent and child traversal

- `hasParent(element, selector, maxDepth?)`
- `findParent(element, selector)`
- `findParents(element, selector, maxDepth?)`
- `hasChild(element, selector)`
- `findChild(element, selector)`
- `findChilds(element, selector, maxDepth?)`

### Templates

- `templateToHtml(templateOrFragment)` converts a template fragment into an HTML string.

Example:

```ts
import {
  addClass,
  createElem,
  findParent,
  getElem,
  insertAfter,
  templateToHtml,
} from '@carry0987/utils/browser';

const title = createElem('h2', { class: 'section-title' }, 'API Reference');
document.body.appendChild(title);

insertAfter(title, '<p class="section-summary">Generated with Utils-JS.</p>');
addClass(title, 'is-ready');

const summary = getElem('.section-summary');
console.log(findParent(summary as Element, 'body'));

const template = document.createElement('template');
template.innerHTML = '<div class="card">Content</div>';
console.log(templateToHtml(template));
```

## Event utilities

The `eventUtils` module wraps native DOM events with typed helpers.

- `addEventListener(element, eventName, handler, options?)`
- `removeEventListener(element, eventName, handler, options?)`
- `createEvent(name, detail?, options?)` creates a `CustomEvent`
- `dispatchEvent(eventOrName, element?, detail?, options?)` dispatches either a pre-built event or a named custom event

`dispatchEvent()` returns `false` when the target or event type is invalid and reports the error.

Example:

```ts
import { addEventListener, dispatchEvent, removeEventListener } from '@carry0987/utils/browser';

const handler = (event: Event) => {
  console.log('Custom event received', event);
};

addEventListener(document, 'docs:ready', handler as EventListener);
dispatchEvent('docs:ready', document, { section: 'browser' });
removeEventListener(document, 'docs:ready', handler as EventListener);
```

## Runtime stylesheet utilities

The browser common module exports helpers for injecting small runtime-generated styles.

- `stylesheetId` stores the current stylesheet prefix, defaulting to `utils-style`
- `replaceRule` stores selector replacement rules, defaulting to `.utils -> .utils-`
- `setStylesheetId(id)` changes the stylesheet id prefix
- `setReplaceRule(from, to)` changes selector replacement behavior
- `injectStylesheet(stylesObject, id?)` creates a style element and inserts generated rules
- `buildRules(ruleObject)` converts a CSS-like object into a CSS string
- `compatInsertRule(stylesheet, selector, cssText, id?)` inserts a single generated CSS rule
- `removeStylesheet(id?)` removes the generated style element

Example:

```ts
import {
  injectStylesheet,
  removeStylesheet,
  setReplaceRule,
  setStylesheetId,
} from '@carry0987/utils/browser';

setStylesheetId('docs-theme-');
setReplaceRule('.utils', '.docs');

injectStylesheet(
  {
    '.utils-card': {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 10px 30px rgba(18, 38, 63, 0.08)',
    },
  },
  'landing'
);

removeStylesheet('landing');
```
