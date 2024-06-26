import { getElem, createElem } from '../module/domUtils';
import { URLParams } from '../interface/interfaces';
import { ReplaceRule, StylesObject } from '../type/types';

export let stylesheetId: string = 'utils-style';
export const replaceRule: ReplaceRule = {
    from: '.utils',
    to: '.utils-'
};

export function isObject(item: unknown): item is Record<string, unknown> {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
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

export function isEmpty(str: unknown): boolean {
    if (typeof str === 'number') {
        return false;
    }

    return !str || (typeof str === 'string' && str.length === 0);
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
                        target[targetKey] = isArray(value) ? [] : {} as any;
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
    sources.forEach(source => {
        if (source) {
            Object.keys(source).forEach(key => {
                const targetKey = key as keyof T;
                const sourceValue = source[targetKey];

                if (isObject(sourceValue) && typeof target[targetKey]?.constructor === 'function' && sourceValue instanceof target[targetKey]!.constructor) {
                    // If the source value is an object and its constructor matches the target's constructor.
                    target[targetKey] = Object.assign(Object.create(Object.getPrototypeOf(sourceValue), {}), sourceValue);
                } else {
                    target[targetKey] = sourceValue as T[typeof targetKey];
                }
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
                clone[key] = isObject(value) 
                    ? shallowClone(value) 
                    : isArray(value) 
                        ? [...value] 
                        : value;
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

export function compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id: string | null = null): void {
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        (c) => {
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export function getUrlParam(sParam: string, url: string = window.location.href): string | null {
    const isHashParam = sParam.startsWith('#');
    let urlPart: string;
    if (isHashParam) {
        urlPart = url.substring(url.indexOf('#') + 1);
    } else {
        const searchPart = url.includes('#') ? url.substring(url.indexOf('?'), url.indexOf('#')) : url.substring(url.indexOf('?'));
        urlPart = searchPart;
    }
    const params = new URLSearchParams(urlPart);
    const paramName = isHashParam ? sParam.substring(1) : sParam;
    const paramValue = params.get(paramName);

    return paramValue === null ? null : decodeURIComponent(paramValue);
}

export function setUrlParam(url: string, params: URLParams, overwrite: boolean = true): string {
    const urlObj = new URL(url);
    // Iterate over params object keys and set params
    for (const [paramName, paramValue] of Object.entries(params)) {
        // Convert paramValue to string, as URLSearchParams only accepts strings
        const valueStr = paramValue === null ? '' : String(paramValue);
        // If overwrite is false and param already exists, skip setting it
        if (!overwrite && urlObj.searchParams.has(paramName)) {
            continue;
        }
        // Set the parameter value
        urlObj.searchParams.set(paramName, valueStr);
    }

    return urlObj.toString();
}
