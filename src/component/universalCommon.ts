import { createUrl, getLocationHrefSafe } from '@/module/runtimeUtils';
import type { URLParams, URLSource } from '@/types/common';

// Narrow nullish values
export function isDefined<T>(v: T): v is Exclude<T, null | undefined> {
    return v !== null && v !== undefined;
}

export function isObject(item: unknown): item is Record<string, unknown> {
    return typeof item === 'object' && item !== null && !isArray(item);
}

export function isFunction(item: unknown): item is (...args: never[]) => unknown {
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
    if (typeof value === 'number') {
        return false;
    }
    if (typeof value === 'string' && value.length === 0) {
        return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    }
    if (isObject(value) && Object.keys(value).length === 0) {
        return true;
    }

    return !value;
}

export function assertNever(x: never, msg = 'Unexpected value'): never {
    throw new Error(`${msg}: ${x}`);
}

export function deepMerge<T>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift() as Partial<T>;
    if (source) {
        for (const key in source) {
            if (Object.hasOwn(source, key)) {
                const sourceKey = key as keyof Partial<T>;
                const value = source[sourceKey];
                const targetKey = key as keyof T;
                if (isObject(value) || isArray(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = (isArray(value) ? [] : {}) as T[typeof targetKey];
                    }
                    deepMerge(
                        target[targetKey] as Record<string, unknown> | unknown[],
                        value as Partial<Record<string, unknown> | unknown[]>
                    );
                } else {
                    target[targetKey] = value as T[typeof targetKey];
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
    let clone: unknown;
    if (isArray(obj)) {
        clone = obj.map((item) => deepClone(item));
    } else if (isObject(obj)) {
        const sourceObject = obj as Record<string, unknown>;
        const objectClone: Record<string, unknown> = { ...sourceObject };
        for (const key in objectClone) {
            if (Object.hasOwn(objectClone, key)) {
                objectClone[key] = deepClone(objectClone[key]);
            }
        }
        clone = objectClone;
    } else {
        clone = obj;
    }

    return clone as T;
}

export function shallowClone<T>(obj: T): T {
    if (isObject(obj) || isArray(obj)) {
        const sourceObject = obj as Record<string, unknown>;
        const clone = (isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj))) as Record<string, unknown>;

        for (const key in sourceObject) {
            if (Object.hasOwn(sourceObject, key)) {
                const value = sourceObject[key];
                clone[key] = isObject(value) ? shallowClone(value) : isArray(value) ? [...value] : value;
            }
        }

        return clone as T;
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
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

export function getUrlParam(sParam: string, url?: string): string | null {
    const sourceUrl = url ?? getLocationHrefSafe();
    if (!sourceUrl) {
        return null;
    }

    const searchIndex = sourceUrl.indexOf('?');
    if (searchIndex === -1) {
        return null;
    }

    const hashIndex = sourceUrl.indexOf('#');
    const searchPart =
        hashIndex !== -1 && hashIndex > searchIndex
            ? sourceUrl.substring(searchIndex, hashIndex)
            : sourceUrl.substring(searchIndex);
    const params = new URLSearchParams(searchPart);
    const paramValue = params.get(sParam);

    return paramValue === null ? null : decodeURIComponent(paramValue);
}

export function getHashParam(sParam: string | null = null, url?: string): string | null {
    const sourceUrl = url ?? getLocationHrefSafe();
    if (!sourceUrl) {
        return null;
    }

    const hashIndex = sourceUrl.indexOf('#');
    if (hashIndex === -1) return null;

    const hashPart = sourceUrl.substring(hashIndex + 1);

    if (sParam === null) {
        const firstSegment = hashPart.split('&')[0];
        if (!firstSegment.includes('=')) {
            return decodeURIComponent(firstSegment);
        }
        return null;
    }

    const params = new URLSearchParams(hashPart);
    const paramValue = params.get(sParam);

    return paramValue === null ? null : decodeURIComponent(paramValue);
}

export function setUrlParam(url: string | URLSource, params: URLParams | null, overwrite: boolean = true): string {
    let originalUrl: string;
    let ignoreArray: string[] = [];

    if (typeof url === 'object') {
        originalUrl = url.url;
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

    const urlObj = createUrl(originalUrl);

    if (params === null) {
        urlObj.search = '';
        return urlObj.toString();
    }

    const searchString = urlObj.search.substring(1);
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

    urlObj.search = finalSearchString ? `?${finalSearchString}` : '';

    return urlObj.toString();
}

export function setHashParam(
    url: string | URLSource,
    params: URLParams | string | null = null,
    overwrite: boolean = true
): string {
    let originalUrl: string;
    let ignoreArray: string[] = [];

    if (typeof url === 'object') {
        originalUrl = url.url;
        if (Array.isArray(url.ignore)) {
            ignoreArray = url.ignore.map((part) => {
                return part.startsWith('#') || part.startsWith('&') ? part.substring(1) : part;
            });
        } else if (typeof url.ignore === 'string') {
            let part = url.ignore;
            if (part.startsWith('#') || part.startsWith('&')) {
                part = part.substring(1);
            }
            ignoreArray.push(part);
        }
    } else {
        originalUrl = url;
    }

    const urlObj = createUrl(originalUrl);

    if (params === null) {
        urlObj.hash = '';
        return urlObj.toString();
    }

    if (typeof params === 'string') {
        const hashString = urlObj.hash.substring(1);
        const paramsList = hashString.length > 0 ? hashString.split('&') : [];
        const ignoredParams: string[] = [];

        for (const param of paramsList) {
            if (ignoreArray.includes(param)) {
                ignoredParams.push(param);
            }
        }

        const finalParts = ignoredParams.length > 0 ? [...ignoredParams, params] : [params];
        urlObj.hash = `#${finalParts.join('&')}`;

        return urlObj.toString();
    }

    const hashString = urlObj.hash.substring(1);
    const paramsList = hashString.length > 0 ? hashString.split('&') : [];

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

    for (const [paramName, paramValue] of Object.entries(params)) {
        const valueStr = paramValue === null ? '' : String(paramValue);
        if (!overwrite && urlSearchParams.has(paramName)) {
            continue;
        }
        urlSearchParams.set(paramName, valueStr);
    }

    const newHashParams = ignoredParams.concat(
        urlSearchParams
            .toString()
            .split('&')
            .filter((p) => p)
    );

    const finalHashString = newHashParams.join('&');

    urlObj.hash = finalHashString ? `#${finalHashString}` : '';

    return urlObj.toString();
}
