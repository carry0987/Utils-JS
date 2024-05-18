const version = '3.3.3';

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
    toggleClass: toggleClass
});

let stylesheetId = 'utils-style';
const replaceRule = {
    from: '.utils',
    to: '.utils-'
};
function isObject(item) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
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
function isEmpty(str) {
    if (typeof str === 'number') {
        return false;
    }
    return !str || (typeof str === 'string' && str.length === 0);
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
                if (isObject(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = {};
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
function setStylesheetId(id) {
    stylesheetId = id;
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
    style.id = stylesheetId + id;
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
    let styleElement = getElem('#' + stylesheetId + styleId);
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}
function generateRandom(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}
function getUrlParam(sParam, url = window.location.href) {
    const isHashParam = sParam.startsWith('#');
    let urlPart;
    if (isHashParam) {
        urlPart = url.substring(url.indexOf('#') + 1);
    }
    else {
        const searchPart = url.includes('#') ? url.substring(url.indexOf('?'), url.indexOf('#')) : url.substring(url.indexOf('?'));
        urlPart = searchPart;
    }
    const params = new URLSearchParams(urlPart);
    const paramName = isHashParam ? sParam.substring(1) : sParam;
    const paramValue = params.get(paramName);
    return paramValue === null ? null : decodeURIComponent(paramValue);
}

var common = /*#__PURE__*/Object.freeze({
    __proto__: null,
    buildRules: buildRules,
    compatInsertRule: compatInsertRule,
    deepMerge: deepMerge,
    generateRandom: generateRandom,
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
    get stylesheetId () { return stylesheetId; }
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

// Append form data
function appendFormData(options, formData = new FormData()) {
    const { data, parentKey = '' } = options;
    if (data !== null && typeof data === 'object') {
        // Check if it is Blob or File, if so, add directly
        if (data instanceof Blob || data instanceof File) {
            const formKey = parentKey || 'file'; // If no key is specified, the default is 'file'
            formData.append(formKey, data);
        }
        else {
            // Traverse object properties
            Object.keys(data).forEach(key => {
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

var formUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    appendFormData: appendFormData,
    encodeFormData: encodeFormData
});

// Fetch API
async function doFetch(options) {
    const { url, method = 'GET', headers = {}, body = null, beforeSend = null, success = null, error = null, } = options;
    let initHeaders = headers instanceof Headers ? headers : new Headers(headers);
    let init = {
        method,
        mode: 'cors',
        headers: initHeaders
    };
    if (body !== null && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
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
    let request = new Request(url, init);
    try {
        const createRequest = await new Promise((resolve) => {
            beforeSend?.();
            resolve(request);
        });
        const response = await fetch(createRequest);
        const responseData = await response.json();
        success?.(responseData);
        return responseData;
    }
    catch (caughtError) {
        error?.(caughtError);
        throw caughtError;
    }
}
// Send data
async function sendData(options) {
    const { url, data, method = 'POST', success, errorCallback, beforeSend } = options;
    const fetchOptions = {
        url: url,
        method: method,
        body: encodeFormData(data),
        beforeSend: beforeSend,
        success: (responseData) => {
            success?.(responseData);
        },
        error: (caughtError) => {
            errorCallback?.(caughtError);
        }
    };
    return doFetch(fetchOptions);
}
// Send form data
async function sendFormData(options) {
    const { url, data, method = 'POST', success, errorCallback, beforeSend } = options;
    const fetchOptions = {
        url: url,
        method: method,
        body: encodeFormData(data),
        beforeSend: beforeSend,
        success: (responseData) => {
            success?.(responseData);
        },
        error: (caughtError) => {
            errorCallback?.(caughtError);
        }
    };
    return doFetch(fetchOptions)
        .then(() => true)
        .catch(() => false);
}

var fetchUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    doFetch: doFetch,
    sendData: sendData,
    sendFormData: sendFormData
});

var types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var interfaces = /*#__PURE__*/Object.freeze({
    __proto__: null
});

export { interfaces as Interfaces, types as Types, addClass, addEventListener, appendFormData, buildRules, common as commonUtils, compatInsertRule, createElem, createEvent, deepMerge, dispatchEvent, doFetch, domUtils, encodeFormData, errorUtils, eventUtils, fetchUtils, findChild, findChilds, findParent, findParents, formUtils, generateRandom, getCookie, getElem, getLocalValue, getSessionValue, getUrlParam, hasChild, hasClass, hasParent, injectStylesheet, insertAfter, insertBefore, isArray, isBoolean, isEmpty, isFunction, isNumber, isObject, isString, removeClass, removeCookie, removeEventListener, removeLocalValue, removeSessionValue, removeStylesheet, replaceRule, reportError, sendData, sendFormData, setCookie, setLocalValue, setReplaceRule, setSessionValue, setStylesheetId, storageUtils, stylesheetId, throwError, toggleClass, version };
