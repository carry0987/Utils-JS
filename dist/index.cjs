'use strict';

const version = '3.8.3';

function reportError(...error) {
    console.error(...error);
}
function throwError(message) {
    throw new Error(message);
}

var errorUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    reportError: reportError,
    throwError: throwError
});

function getElem(ele, mode, parent) {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string') {
        return ele;
    }
    let searchContext = document;
    if (mode === null && parent) {
        searchContext = parent;
    }
    else if (mode && mode instanceof Node && 'querySelector' in mode) {
        searchContext = mode;
    }
    else if (parent && parent instanceof Node && 'querySelector' in parent) {
        searchContext = parent;
    }
    // If mode is 'all', search for all elements that match, otherwise, search for the first match
    // Casting the result as E or NodeList
    return mode === 'all' ? searchContext.querySelectorAll(ele) : searchContext.querySelector(ele);
}
function createElem(tagName, attrs = {}, text = '') {
    let elem = document.createElement(tagName);
    for (let attr in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
            if (attr === 'textContent' || attr === 'innerText') {
                elem.textContent = attrs[attr];
            }
            else {
                elem.setAttribute(attr, attrs[attr]);
            }
        }
    }
    if (text)
        elem.textContent = text;
    return elem;
}
function insertAfter(referenceNode, newNode) {
    if (typeof newNode === 'string') {
        let elem = createElem('div');
        elem.innerHTML = newNode;
        newNode = elem.firstChild;
        if (!newNode) {
            throwError('The new node (string) provided did not produce a valid DOM element.');
        }
    }
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function insertBefore(referenceNode, newNode) {
    if (typeof newNode === 'string') {
        let elem = createElem('div');
        elem.innerHTML = newNode;
        newNode = elem.firstChild;
        if (!newNode) {
            throwError('The new node (string) provided did not produce a valid DOM element.');
        }
    }
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}
function addClass(ele, className) {
    ele.classList.add(className);
    return ele;
}
function removeClass(ele, className) {
    ele.classList.remove(className);
    return ele;
}
function toggleClass(ele, className, force) {
    ele.classList.toggle(className, force);
    return ele;
}
function hasClass(ele, className) {
    return ele.classList.contains(className);
}
function hasParent(ele, selector, maxDepth = Infinity, returnElement = false) {
    let parent = ele.parentElement;
    let depth = 0;
    while (parent && depth < maxDepth) {
        if (parent.matches(selector)) {
            return returnElement ? parent : true;
        }
        parent = parent.parentElement;
        depth++;
    }
    return returnElement ? null : false;
}
function findParent(ele, selector) {
    return ele.closest(selector);
}
function findParents(ele, selector, maxDepth = Infinity) {
    const parents = [];
    let parent = ele.parentElement;
    let depth = 0;
    while (parent && depth < maxDepth) {
        if (parent.matches(selector)) {
            parents.push(parent);
        }
        parent = parent.parentElement;
        depth++;
    }
    return parents;
}
function hasChild(ele, selector) {
    return ele.querySelector(selector) !== null;
}
function findChild(ele, selector) {
    return ele.querySelector(selector);
}
function findChilds(ele, selector, maxDepth = Infinity) {
    const results = [];
    function recursiveFind(element, depth) {
        if (depth > maxDepth)
            return;
        Array.from(element.children).forEach((child) => {
            if (child.matches(selector)) {
                results.push(child);
            }
            recursiveFind(child, depth + 1);
        });
    }
    recursiveFind(ele, 0);
    return results;
}
function templateToHtml(templateElem) {
    let sourceElem;
    // Check the type of templateElem
    if (templateElem instanceof HTMLTemplateElement) {
        // If it's a HTMLTemplateElement, proceed with cloning content
        sourceElem = templateElem.content.cloneNode(true);
    }
    else {
        // If it's a DocumentFragment, proceed with cloning content
        sourceElem = templateElem;
    }
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(sourceElem);
    return tempDiv.innerHTML;
}

var domUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addClass: addClass,
    createElem: createElem,
    findChild: findChild,
    findChilds: findChilds,
    findParent: findParent,
    findParents: findParents,
    getElem: getElem,
    hasChild: hasChild,
    hasClass: hasClass,
    hasParent: hasParent,
    insertAfter: insertAfter,
    insertBefore: insertBefore,
    removeClass: removeClass,
    templateToHtml: templateToHtml,
    toggleClass: toggleClass
});

exports.stylesheetId = 'utils-style';
const replaceRule = {
    from: '.utils',
    to: '.utils-'
};
function isObject(item) {
    return typeof item === 'object' && item !== null && !isArray(item);
}
function isFunction(item) {
    return typeof item === 'function';
}
function isString(item) {
    return typeof item === 'string';
}
function isNumber(item) {
    return typeof item === 'number';
}
function isBoolean(item) {
    return typeof item === 'boolean';
}
function isArray(item) {
    return Array.isArray(item);
}
function isEmpty(value) {
    // Check for number
    if (typeof value === 'number') {
        return false;
    }
    // Check for string
    if (typeof value === 'string' && value.length === 0) {
        return true;
    }
    // Check for array
    if (isArray(value) && value.length === 0) {
        return true;
    }
    // Check for object
    if (isObject(value) && Object.keys(value).length === 0) {
        return true;
    }
    // Check for any falsy values
    return !value;
}
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key;
                const value = source[sourceKey];
                const targetKey = key;
                if (isObject(value) || isArray(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = isArray(value) ? [] : {};
                    }
                    deepMerge(target[targetKey], value);
                }
                else {
                    target[targetKey] = value;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
}
function shallowMerge(target, ...sources) {
    sources.forEach((source) => {
        if (source) {
            Object.keys(source).forEach((key) => {
                const targetKey = key;
                target[targetKey] = source[targetKey];
            });
        }
    });
    return target;
}
function deepClone(obj) {
    let clone;
    if (isArray(obj)) {
        clone = obj.map((item) => deepClone(item));
    }
    else if (isObject(obj)) {
        clone = { ...obj };
        for (let key in clone) {
            if (clone.hasOwnProperty(key)) {
                clone[key] = deepClone(clone[key]);
            }
        }
    }
    else {
        clone = obj;
    }
    return clone;
}
function shallowClone(obj) {
    if (isObject(obj) || isArray(obj)) {
        // Recursively clone properties
        const clone = isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                clone[key] = isObject(value) ? shallowClone(value) : isArray(value) ? [...value] : value;
            }
        }
        return clone;
    }
    return obj;
}
function deepEqual(obj1, obj2) {
    if (typeof obj1 !== typeof obj2)
        return false;
    if (obj1 === null || obj2 === null)
        return obj1 === obj2;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }
    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length)
            return false;
        return obj1.every((item, index) => deepEqual(item, obj2[index]));
    }
    if (Array.isArray(obj1) || Array.isArray(obj2))
        return false;
    if (obj1 instanceof Set && obj2 instanceof Set) {
        if (obj1.size !== obj2.size)
            return false;
        for (const item of obj1) {
            if (!obj2.has(item))
                return false;
        }
        return true;
    }
    if (obj1 instanceof Map && obj2 instanceof Map) {
        if (obj1.size !== obj2.size)
            return false;
        for (const [key, value] of obj1) {
            if (!deepEqual(value, obj2.get(key)))
                return false;
        }
        return true;
    }
    if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2))
        return false;
    const keys1 = Reflect.ownKeys(obj1);
    const keys2 = Reflect.ownKeys(obj2);
    if (keys1.length !== keys2.length)
        return false;
    for (const key of keys1) {
        if (!deepEqual(obj1[key], obj2[key]))
            return false;
    }
    return true;
}
function shallowEqual(obj1, obj2) {
    if (typeof obj1 !== typeof obj2)
        return false;
    if (obj1 === null || obj2 === null)
        return obj1 === obj2;
    // If both are the same reference, they are equal
    if (obj1 === obj2)
        return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return obj1 === obj2;
    }
    const keys1 = Reflect.ownKeys(obj1);
    const keys2 = Reflect.ownKeys(obj2);
    if (keys1.length !== keys2.length)
        return false;
    for (const key of keys1) {
        if (obj1[key] !== obj2[key])
            return false;
    }
    return true;
}
function setStylesheetId(id) {
    exports.stylesheetId = id;
}
function setReplaceRule(from, to) {
    replaceRule.from = from;
    replaceRule.to = to;
}
// CSS Injection
function injectStylesheet(stylesObject, id = null) {
    id = isEmpty(id) ? '' : id;
    // Create a style element
    let style = createElem('style');
    // WebKit hack
    style.id = exports.stylesheetId + id;
    style.textContent = '';
    // Add the style element to the document head
    document.head.append(style);
    let stylesheet = style.sheet;
    for (let selector in stylesObject) {
        if (stylesObject.hasOwnProperty(selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}
function buildRules(ruleObject) {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }
    return ruleSet;
}
function compatInsertRule(stylesheet, selector, cssText, id = null) {
    id = isEmpty(id) ? '' : id;
    let modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
}
function removeStylesheet(id = null) {
    const styleId = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + exports.stylesheetId + styleId);
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}
function generateRandom(length = 8) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
    }
    return result;
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function getUrlParam(sParam, url = window.location.href) {
    const isHashParam = sParam.startsWith('#');
    let urlPart;
    if (isHashParam) {
        urlPart = url.substring(url.indexOf('#') + 1);
    }
    else {
        const searchPart = url.includes('#')
            ? url.substring(url.indexOf('?'), url.indexOf('#'))
            : url.substring(url.indexOf('?'));
        urlPart = searchPart;
    }
    const params = new URLSearchParams(urlPart);
    const paramName = isHashParam ? sParam.substring(1) : sParam;
    const paramValue = params.get(paramName);
    return paramValue === null ? null : decodeURIComponent(paramValue);
}
function setUrlParam(url, params, overwrite = true) {
    let originalUrl;
    let ignoreArray = [];
    // Determine if URLSource object is being used
    if (typeof url === 'object') {
        originalUrl = url.url; // Extract the URL string
        if (Array.isArray(url.ignore)) {
            ignoreArray = url.ignore.map((part) => {
                return part.startsWith('?') || part.startsWith('&') ? part.substring(1) : part;
            });
        }
        else if (typeof url.ignore === 'string') {
            let part = url.ignore;
            if (part.startsWith('?') || part.startsWith('&')) {
                part = part.substring(1);
            }
            ignoreArray.push(part);
        }
    }
    else {
        originalUrl = url;
    }
    const urlObj = new URL(originalUrl);
    // Extract search string
    let searchString = urlObj.search.substring(1); // Remove the leading '?'
    // Split the search string into parameters
    const paramsList = searchString.length > 0 ? searchString.split('&') : [];
    const ignoredParams = [];
    const otherParams = [];
    for (const param of paramsList) {
        if (ignoreArray.includes(param)) {
            ignoredParams.push(param);
        }
        else {
            otherParams.push(param);
        }
    }
    const urlSearchParams = new URLSearchParams(otherParams.join('&'));
    // Process remaining logic to set params
    for (const [paramName, paramValue] of Object.entries(params)) {
        const valueStr = paramValue === null ? '' : String(paramValue);
        if (!overwrite && urlSearchParams.has(paramName)) {
            continue;
        }
        urlSearchParams.set(paramName, valueStr);
    }
    const newSearchParams = ignoredParams.concat(urlSearchParams
        .toString()
        .split('&')
        .filter((p) => p));
    const finalSearchString = newSearchParams.join('&');
    urlObj.search = finalSearchString ? '?' + finalSearchString : '';
    return urlObj.toString();
}

var common = /*#__PURE__*/Object.freeze({
    __proto__: null,
    buildRules: buildRules,
    compatInsertRule: compatInsertRule,
    deepClone: deepClone,
    deepEqual: deepEqual,
    deepMerge: deepMerge,
    generateRandom: generateRandom,
    generateUUID: generateUUID,
    getUrlParam: getUrlParam,
    injectStylesheet: injectStylesheet,
    isArray: isArray,
    isBoolean: isBoolean,
    isEmpty: isEmpty,
    isFunction: isFunction,
    isNumber: isNumber,
    isObject: isObject,
    isString: isString,
    removeStylesheet: removeStylesheet,
    replaceRule: replaceRule,
    setReplaceRule: setReplaceRule,
    setStylesheetId: setStylesheetId,
    setUrlParam: setUrlParam,
    shallowClone: shallowClone,
    shallowEqual: shallowEqual,
    shallowMerge: shallowMerge,
    get stylesheetId () { return exports.stylesheetId; }
});

function setLocalValue(key, value, stringify = true) {
    if (stringify) {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
}
function getLocalValue(key, parseJson = true) {
    let value = window.localStorage.getItem(key);
    if (parseJson) {
        try {
            value = JSON.parse(value);
        }
        catch (e) {
            reportError('Error while parsing stored json value: ', e);
        }
    }
    return value;
}
function removeLocalValue(key) {
    window.localStorage.removeItem(key);
}
function setSessionValue(key, value, stringify = true) {
    if (stringify) {
        value = JSON.stringify(value);
    }
    window.sessionStorage.setItem(key, value);
}
function getSessionValue(key, parseJson = true) {
    let value = window.sessionStorage.getItem(key);
    if (parseJson) {
        try {
            value = JSON.parse(value);
        }
        catch (e) {
            reportError('Error while parsing stored json value: ', e);
        }
    }
    return value;
}
function removeSessionValue(key) {
    window.sessionStorage.removeItem(key);
}
function setCookie(name, value, options) {
    let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
    const defaultOptions = {
        expires: new Date(Date.now() + 86400000), // 1 day
        path: '/',
        secure: false,
        sameSite: 'Lax'
    };
    options = deepMerge({}, defaultOptions, options || {});
    if (options.expires) {
        let expiresValue = '';
        if (options.expires instanceof Date) {
            expiresValue = options.expires.toUTCString();
        }
        else {
            expiresValue = new Date(String(options.expires)).toUTCString();
        }
        cookieString += 'expires=' + expiresValue + ';';
    }
    cookieString += 'path=' + options.path + ';';
    if (options.domain) {
        cookieString += 'domain=' + options.domain + ';';
    }
    if (options.secure) {
        cookieString += 'secure;';
    }
    cookieString += 'SameSite=' + options.sameSite + ';';
    document.cookie = cookieString;
}
function getCookie(name) {
    const nameEQ = encodeURIComponent(name) + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
function removeCookie(name) {
    setCookie(name, '', { expires: new Date(0) });
}

var storageUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getCookie: getCookie,
    getLocalValue: getLocalValue,
    getSessionValue: getSessionValue,
    removeCookie: removeCookie,
    removeLocalValue: removeLocalValue,
    removeSessionValue: removeSessionValue,
    setCookie: setCookie,
    setLocalValue: setLocalValue,
    setSessionValue: setSessionValue
});

function addEventListener(element, eventName, handler, options) {
    element.addEventListener(eventName, handler, options);
}
function removeEventListener(element, eventName, handler, options) {
    element.removeEventListener(eventName, handler, options);
}
function createEvent(eventName, detail, options) {
    return new CustomEvent(eventName, { detail, ...options });
}
function dispatchEvent(eventOrName, element = document, detail, options) {
    try {
        if (typeof eventOrName === 'string') {
            let event = createEvent(eventOrName, detail, options);
            return element.dispatchEvent(event);
        }
        else if (eventOrName instanceof Event) {
            return element.dispatchEvent(eventOrName);
        }
        else {
            throwError('Invalid event type');
        }
    }
    catch (e) {
        reportError('Dispatch Event Error:', e);
        return false;
    }
}

var eventUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addEventListener: addEventListener,
    createEvent: createEvent,
    dispatchEvent: dispatchEvent,
    removeEventListener: removeEventListener
});

/**
 * Throttle a given function
 *
 * @param fn Function to be called
 * @param wait Throttle timeout in milliseconds
 * @param options Throttle options
 *
 * @returns Throttled function
 */
function throttle(fn, wait = 100, options = { leading: false, trailing: true }) {
    const { leading = false, trailing = true } = options;
    let timeoutId;
    let lastTime = leading ? -Infinity : Date.now();
    const invokeFn = (...args) => {
        lastTime = Date.now();
        fn(...args);
    };
    return (...args) => {
        const currentTime = Date.now();
        const elapsed = currentTime - lastTime;
        if (elapsed >= wait) {
            // Execute the function immediately, ensuring to clear any previous timer
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
            invokeFn(...args);
        }
        else if (trailing && timeoutId === undefined) {
            timeoutId = setTimeout(() => {
                invokeFn(...args);
                timeoutId = undefined;
            }, wait - elapsed);
        }
    };
}
/**
 * Creates a debounced function that delays the invocation of the provided function
 * until after the specified wait time has elapsed since the last time it was called.
 *
 * @param fn - The original function to debounce.
 * @param wait - The number of milliseconds to delay the function call.
 * @param options - Debounce options.
 *
 * @returns A debounced function that returns a Promise resolving to the result of the original function.
 */
function debounce(fn, wait, options = { leading: false, trailing: true }) {
    const { leading = false, trailing = true, maxWait } = options;
    let timeoutId;
    let lastInvokeTime = 0;
    let result;
    const invokeFn = (args) => {
        lastInvokeTime = Date.now();
        result = fn(...args);
        return result;
    };
    return (...args) => new Promise((resolve) => {
        const currentTime = Date.now();
        const elapsed = currentTime - lastInvokeTime;
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        if (maxWait !== undefined && elapsed >= maxWait) {
            resolve(invokeFn(args));
        }
        else if (leading && elapsed > wait) {
            resolve(invokeFn(args));
        }
        timeoutId = setTimeout(() => {
            if (trailing && !leading) {
                resolve(invokeFn(args));
            }
            timeoutId = undefined; // Clear timeout after it's been executed
        }, wait);
    });
}

var executeUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    debounce: debounce,
    throttle: throttle
});

// Append form data
function appendFormData(options, formData = new FormData()) {
    const { data, parentKey = '' } = options;
    if (data instanceof FormData) {
        data.forEach((value, key) => {
            formData.append(key, value);
        });
    }
    else if (data !== null && typeof data === 'object') {
        // Check if it is Blob or File, if so, add directly
        if (data instanceof Blob || data instanceof File) {
            const formKey = parentKey || 'file'; // If no key is specified, the default is 'file'
            formData.append(formKey, data);
        }
        else {
            // Traverse object properties
            Object.keys(data).forEach((key) => {
                const value = data[key];
                const formKey = parentKey ? `${parentKey}[${key}]` : key;
                if (value !== null && typeof value === 'object') {
                    // Recursively call to handle nested objects
                    appendFormData({ data: value, parentKey: formKey }, formData);
                }
                else if (value !== null) {
                    // Handle non-empty values, add directly
                    formData.append(formKey, String(value));
                }
            });
        }
    }
    else if (data !== null) {
        // Non-object and non-null values, add directly
        formData.append(parentKey, data);
    }
    // If you don't want to add null values to FormData, you can do nothing here
    // Or if you want to convert null to other forms, you can handle it here
    return formData;
}
// Encode form data before send
function encodeFormData(data, parentKey = '') {
    if (data instanceof FormData) {
        return data;
    }
    const options = {
        data: data,
        parentKey: parentKey
    };
    return appendFormData(options);
}
// Decode FormData back to an object
function decodeFormData(formData) {
    const data = {};
    formData.forEach((value, key) => {
        // If a key already exists, convert to an array or push to existing array
        if (key in data) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            }
            else {
                data[key] = [data[key], value];
            }
        }
        else {
            data[key] = value;
        }
    });
    return data;
}
// Convert FormData to URLParams
function formDataToURLParams(formData) {
    const params = {};
    formData.forEach((value, key) => {
        // Assume formData values are strings, additional parsing can be added if needed
        if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || value === null) {
            params[key] = value;
        }
        else {
            // Convert any non-string values to string if necessary
            params[key] = value.toString();
        }
    });
    return params;
}
// Convert a generic body to URLParams
function bodyToURLParams(body) {
    const params = {};
    if (body instanceof FormData) {
        return formDataToURLParams(body);
    }
    else if (typeof body === 'object') {
        // Handle generic object by iterating over its keys
        Object.entries(body).forEach(([key, value]) => {
            if (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean' ||
                value === null) {
                params[key] = value;
            }
            else {
                params[key] = JSON.stringify(value); // Serialize complex objects
            }
        });
    }
    return params;
}

var formUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    appendFormData: appendFormData,
    bodyToURLParams: bodyToURLParams,
    decodeFormData: decodeFormData,
    encodeFormData: encodeFormData,
    formDataToURLParams: formDataToURLParams
});

// Fetch API
async function doFetch(options) {
    const { url, method = 'GET', headers = {}, cache = 'no-cache', mode = 'cors', credentials = 'same-origin', body = null, beforeSend = null, success = null, error = null } = options;
    let requestURL = url;
    const initHeaders = headers instanceof Headers ? headers : new Headers(headers);
    const init = {
        method: method,
        mode: mode,
        headers: initHeaders,
        cache: cache,
        credentials: credentials
    };
    if (body && body !== null && method.toUpperCase() === 'GET') {
        const params = bodyToURLParams(body);
        requestURL = setUrlParam(typeof url === 'string' ? url : url.toString(), params, true);
    }
    else if (body && body !== null && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
        let data = body;
        if (!(body instanceof FormData)) {
            data = JSON.stringify(body);
            if (!(init.headers instanceof Headers)) {
                init.headers = new Headers(init.headers);
            }
            init.headers.append('Content-Type', 'application/json');
        }
        init.body = data;
    }
    // Handle different types of URL
    let request;
    if (typeof requestURL === 'string' || requestURL instanceof URL) {
        request = new Request(requestURL, init);
    }
    else if (requestURL instanceof Request) {
        request = requestURL;
    }
    else {
        throw new Error('Invalid URL type');
    }
    try {
        const createRequest = await new Promise((resolve) => {
            beforeSend?.();
            resolve(request);
        });
        const response = await fetch(createRequest);
        if (response.ok) {
            if (typeof success === 'function') {
                // Clone the response and parse the clone
                const clonedResponse = response.clone();
                const responseData = (await clonedResponse.json());
                success?.(responseData);
            }
        }
        else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    }
    catch (caughtError) {
        const errorObj = caughtError instanceof Error ? caughtError : new Error(String(caughtError));
        error?.(errorObj);
        throw errorObj;
    }
}
// Send data
async function sendData(options) {
    const { url, data, method = 'POST', headers, cache, mode, credentials, success, error, beforeSend, encode = true } = options;
    const fetchOptions = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        credentials: credentials,
        body: encode && method.toUpperCase() !== 'GET' ? encodeFormData(data) : data,
        beforeSend: beforeSend,
        success: success,
        error: error
    };
    return (await doFetch(fetchOptions)).json();
}
// Send form data
async function sendFormData(options) {
    const { url, data, method = 'POST', headers, cache, mode, credentials, success, error, beforeSend } = options;
    const fetchOptions = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        credentials: credentials,
        body: data ? encodeFormData(data) : null,
        beforeSend: beforeSend,
        success: success,
        error: error
    };
    return doFetch(fetchOptions)
        .then(() => true)
        .catch(() => false);
}
// Alias for sendData
const fetchData = sendData;
// Alias for sendFormData
const sendForm = sendFormData;

var fetchUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    doFetch: doFetch,
    fetchData: fetchData,
    sendData: sendData,
    sendForm: sendForm,
    sendFormData: sendFormData
});

var types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var interfaces = /*#__PURE__*/Object.freeze({
    __proto__: null
});

exports.Interfaces = interfaces;
exports.Types = types;
exports.addClass = addClass;
exports.addEventListener = addEventListener;
exports.appendFormData = appendFormData;
exports.bodyToURLParams = bodyToURLParams;
exports.buildRules = buildRules;
exports.commonUtils = common;
exports.compatInsertRule = compatInsertRule;
exports.createElem = createElem;
exports.createEvent = createEvent;
exports.debounce = debounce;
exports.decodeFormData = decodeFormData;
exports.deepClone = deepClone;
exports.deepEqual = deepEqual;
exports.deepMerge = deepMerge;
exports.dispatchEvent = dispatchEvent;
exports.doFetch = doFetch;
exports.domUtils = domUtils;
exports.encodeFormData = encodeFormData;
exports.errorUtils = errorUtils;
exports.eventUtils = eventUtils;
exports.executeUtils = executeUtils;
exports.fetchData = fetchData;
exports.fetchUtils = fetchUtils;
exports.findChild = findChild;
exports.findChilds = findChilds;
exports.findParent = findParent;
exports.findParents = findParents;
exports.formDataToURLParams = formDataToURLParams;
exports.formUtils = formUtils;
exports.generateRandom = generateRandom;
exports.generateUUID = generateUUID;
exports.getCookie = getCookie;
exports.getElem = getElem;
exports.getLocalValue = getLocalValue;
exports.getSessionValue = getSessionValue;
exports.getUrlParam = getUrlParam;
exports.hasChild = hasChild;
exports.hasClass = hasClass;
exports.hasParent = hasParent;
exports.injectStylesheet = injectStylesheet;
exports.insertAfter = insertAfter;
exports.insertBefore = insertBefore;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isEmpty = isEmpty;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.removeClass = removeClass;
exports.removeCookie = removeCookie;
exports.removeEventListener = removeEventListener;
exports.removeLocalValue = removeLocalValue;
exports.removeSessionValue = removeSessionValue;
exports.removeStylesheet = removeStylesheet;
exports.replaceRule = replaceRule;
exports.reportError = reportError;
exports.sendData = sendData;
exports.sendForm = sendForm;
exports.sendFormData = sendFormData;
exports.setCookie = setCookie;
exports.setLocalValue = setLocalValue;
exports.setReplaceRule = setReplaceRule;
exports.setSessionValue = setSessionValue;
exports.setStylesheetId = setStylesheetId;
exports.setUrlParam = setUrlParam;
exports.shallowClone = shallowClone;
exports.shallowEqual = shallowEqual;
exports.shallowMerge = shallowMerge;
exports.storageUtils = storageUtils;
exports.templateToHtml = templateToHtml;
exports.throttle = throttle;
exports.throwError = throwError;
exports.toggleClass = toggleClass;
exports.version = version;
