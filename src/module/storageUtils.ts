import { deepMerge } from '@/component/universalCommon';
import type { CookieOptions } from '@/interfaces/internal';
import { reportError } from './errorUtils';
import { getDocumentSafe, getLocalStorageSafe, getSessionStorageSafe } from './runtimeUtils';

export function setLocalValue(key: string, value: unknown, stringify = true): void {
    const storedValue = stringify ? JSON.stringify(value) : String(value);
    getLocalStorageSafe()?.setItem(key, storedValue);
}

export function getLocalValue<T = unknown>(key: string, parseJson?: true): T | null;
export function getLocalValue(key: string, parseJson: false): string | null;
export function getLocalValue<T = unknown>(key: string, parseJson: boolean = true): T | string | null {
    const value = getLocalStorageSafe()?.getItem(key) ?? null;
    if (value === null) return null;
    if (parseJson) {
        try {
            return JSON.parse(value) as T;
        } catch (e) {
            reportError('Error while parsing stored json value: ', e);
        }
    }

    return value;
}

export function removeLocalValue(key: string): void {
    getLocalStorageSafe()?.removeItem(key);
}

export function setSessionValue(key: string, value: unknown, stringify: boolean = true): void {
    const storedValue = stringify ? JSON.stringify(value) : String(value);
    getSessionStorageSafe()?.setItem(key, storedValue);
}

export function getSessionValue<T = unknown>(key: string, parseJson?: true): T | null;
export function getSessionValue(key: string, parseJson: false): string | null;
export function getSessionValue<T = unknown>(key: string, parseJson: boolean = true): T | string | null {
    const value = getSessionStorageSafe()?.getItem(key) ?? null;
    if (value === null) return null;
    if (parseJson) {
        try {
            return JSON.parse(value) as T;
        } catch (e) {
            reportError('Error while parsing stored json value: ', e);
        }
    }

    return value;
}

export function removeSessionValue(key: string): void {
    getSessionStorageSafe()?.removeItem(key);
}

export function setCookie(name: string, value: string, options?: CookieOptions): void {
    const currentDocument = getDocumentSafe();
    if (!currentDocument) {
        return;
    }

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;
    const defaultOptions: CookieOptions = {
        expires: new Date(Date.now() + 86400000), // 1 day
        path: '/',
        secure: false,
        sameSite: 'Lax'
    };
    options = deepMerge({}, defaultOptions, options || {});
    if (options.expires) {
        let expiresValue: string = '';
        if (options.expires instanceof Date) {
            expiresValue = options.expires.toUTCString();
        } else {
            expiresValue = new Date(String(options.expires)).toUTCString();
        }
        cookieString += `expires=${expiresValue};`;
    }
    cookieString += `path=${options.path};`;
    if (options.domain) {
        cookieString += `domain=${options.domain};`;
    }
    if (options.secure) {
        cookieString += 'secure;';
    }
    cookieString += `SameSite=${options.sameSite};`;
    currentDocument.cookie = cookieString;
}

export function getCookie(name: string): string | null {
    const currentDocument = getDocumentSafe();
    if (!currentDocument) {
        return null;
    }

    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = currentDocument.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }

    return null;
}

export function removeCookie(name: string): void {
    setCookie(name, '', { expires: new Date(0) });
}
