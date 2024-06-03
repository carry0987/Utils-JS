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
    if (isObject(obj)) {
        return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    } else if (isArray(obj)) {
        return obj.slice() as unknown as T;
    }

    return obj;
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
    return Math.random().toString(36).substring(2, 2 + length);
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
