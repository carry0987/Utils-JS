import { getElem, createElem } from '@/module/domUtils';
import { URLSource, URLParams } from '@/interfaces/internal';
import { ReplaceRule, StylesObject } from '@/types/internal';

export let stylesheetId: string = 'utils-style';
export const replaceRule: ReplaceRule = {
    from: '.utils',
    to: '.utils-'
};

// Narrow nullish values
export function isDefined<T>(v: T): v is Exclude<T, null | undefined> {
    return v !== null && v !== undefined;
}

export function isObject(item: unknown): item is Record<string, unknown> {
    return typeof item === 'object' && item !== null && !isArray(item);
}

export function isFunction(item: unknown): item is Function {
    return typeof item === 'function';
}

export function isString(item: unknown): item is string {
    return typeof item === 'string';
}

export function isNumber(item: unknown): item is number {
    return typeof item === 'number';
}

export function isBoolean(item: unknown): item is boolean {
    return typeof item === 'boolean';
}

export function isArray(item: unknown): item is unknown[] {
    return Array.isArray(item);
}

export function isEmpty(value: unknown): boolean {
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

// Assert never for exhaustive checks (helps switch statements)
export function assertNever(x: never, msg = 'Unexpected value'): never {
    throw new Error(`${msg}: ${x}`);
}

export function deepMerge<T>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift() as Partial<T>;
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key as keyof Partial<T>;
                const value = source[sourceKey];
                const targetKey = key as keyof T;
                if (isObject(value) || isArray(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = isArray(value) ? [] : ({} as any);
                    }
                    deepMerge(target[targetKey] as any, value as any);
                } else {
                    target[targetKey] = value as any;
                }
            }
        }
    }

    return deepMerge(target, ...sources);
}

export function shallowMerge<T>(target: T, ...sources: Partial<T>[]): T {
    sources.forEach((source) => {
        if (source) {
            Object.keys(source).forEach((key) => {
                const targetKey = key as keyof T;
                target[targetKey] = source[targetKey] as T[typeof targetKey];
            });
        }
    });

    return target;
}

export function deepClone<T>(obj: T): T {
    let clone: any;
    if (isArray(obj)) {
        clone = obj.map((item) => deepClone(item));
    } else if (isObject(obj)) {
        clone = { ...obj };
        for (let key in clone) {
            if (clone.hasOwnProperty(key)) {
                clone[key] = deepClone(clone[key]);
            }
        }
    } else {
        clone = obj;
    }

    return clone;
}

export function shallowClone<T>(obj: T): T {
    if (isObject(obj) || isArray(obj)) {
        // Recursively clone properties
        const clone = isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = (obj as any)[key];
                clone[key] = isObject(value) ? shallowClone(value) : isArray(value) ? [...value] : value;
            }
        }

        return clone;
    }

    return obj;
}

export function deepEqual<T>(obj1: T, obj2: T): boolean {
    if (typeof obj1 !== typeof obj2) return false;

    if (obj1 === null || obj2 === null) return obj1 === obj2;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }

    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        return obj1.every((item, index) => deepEqual(item, obj2[index]));
    }

    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    if (obj1 instanceof Set && obj2 instanceof Set) {
        if (obj1.size !== obj2.size) return false;
        for (const item of obj1) {
            if (!obj2.has(item)) return false;
        }
        return true;
    }

    if (obj1 instanceof Map && obj2 instanceof Map) {
        if (obj1.size !== obj2.size) return false;
        for (const [key, value] of obj1) {
            if (!deepEqual(value, obj2.get(key))) return false;
        }
        return true;
    }

    if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2)) return false;

    const keys1 = Reflect.ownKeys(obj1) as (keyof T)[];
    const keys2 = Reflect.ownKeys(obj2) as (keyof T)[];
    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

export function shallowEqual<T>(obj1: T, obj2: T): boolean {
    if (typeof obj1 !== typeof obj2) return false;

    if (obj1 === null || obj2 === null) return obj1 === obj2;

    // If both are the same reference, they are equal
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return obj1 === obj2;
    }

    const keys1 = Reflect.ownKeys(obj1) as (keyof T)[];
    const keys2 = Reflect.ownKeys(obj2) as (keyof T)[];

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }

    return true;
}

export function setStylesheetId(id: string): void {
    stylesheetId = id;
}

export function setReplaceRule(from: string, to: string): void {
    replaceRule.from = from;
    replaceRule.to = to;
}

// CSS Injection
export function injectStylesheet(stylesObject: StylesObject, id: string | null = null): void {
    id = isEmpty(id) ? '' : id;
    // Create a style element
    let style = createElem('style') as HTMLStyleElement;
    // WebKit hack
    style.id = stylesheetId + id;
    style.textContent = '';
    // Add the style element to the document head
    document.head.append(style);

    let stylesheet = style.sheet as CSSStyleSheet;

    for (let selector in stylesObject) {
        if (stylesObject.hasOwnProperty(selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}

export function buildRules(ruleObject: Record<string, string>): string {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }

    return ruleSet;
}

export function compatInsertRule(
    stylesheet: CSSStyleSheet,
    selector: string,
    cssText: string,
    id: string | null = null
): void {
    id = isEmpty(id) ? '' : id;
    let modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
}

export function removeStylesheet(id: string | null = null): void {
    const styleId = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + stylesheetId + styleId);
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}

export function generateRandom(length: number = 8): string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
    }

    return result;
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function isValidURL(url: string): boolean {
    try {
        new URL(url); // Try to create a URL object
        return true;
    } catch (_) {
        return false; // If error, the URL is invalid
    }
}

export function getUrlParam(sParam: string, url: string = window.location.href): string | null {
    const isHashParam = sParam.startsWith('#');
    let urlPart: string;

    if (isHashParam) {
        urlPart = url.substring(url.indexOf('#') + 1);
    } else {
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

export function setUrlParam(url: string | URLSource, params: URLParams | null, overwrite: boolean = true): string {
    let originalUrl: string;
    let ignoreArray: string[] = [];

    // Determine if URLSource object is being used
    if (typeof url === 'object') {
        originalUrl = url.url; // Extract the URL string
        if (Array.isArray(url.ignore)) {
            ignoreArray = url.ignore.map((part) => {
                return part.startsWith('?') || part.startsWith('&') ? part.substring(1) : part;
            });
        } else if (typeof url.ignore === 'string') {
            let part = url.ignore;
            if (part.startsWith('?') || part.startsWith('&')) {
                part = part.substring(1);
            }
            ignoreArray.push(part);
        }
    } else {
        originalUrl = url;
    }

    const urlObj = new URL(originalUrl);

    // If params is null, remove all
    if (params === null) {
        urlObj.search = ''; // Remove all search params
        return urlObj.toString();
    }

    // Extract search string
    let searchString = urlObj.search.substring(1); // Remove the leading '?'

    // Split the search string into parameters
    const paramsList = searchString.length > 0 ? searchString.split('&') : [];

    const ignoredParams: string[] = [];
    const otherParams: string[] = [];

    for (const param of paramsList) {
        if (ignoreArray.includes(param)) {
            ignoredParams.push(param);
        } else {
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

    const newSearchParams = ignoredParams.concat(
        urlSearchParams
            .toString()
            .split('&')
            .filter((p) => p)
    );

    const finalSearchString = newSearchParams.join('&');

    urlObj.search = finalSearchString ? '?' + finalSearchString : '';

    return urlObj.toString();
}
