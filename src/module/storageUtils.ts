import { reportError } from './errorUtils';
import { deepMerge } from '@/component/common';
import { CookieOptions } from '@/interface/interfaces';

export function setLocalValue(key: string, value: any, stringify = true): void {
    if (stringify) {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
}

export function getLocalValue(key: string, parseJson: boolean = true): any {
    let value = window.localStorage.getItem(key);
    if (parseJson) {
        try {
            value = JSON.parse(value!);
        } catch (e) {
            reportError('Error while parsing stored json value: ', e);
        }
    }

    return value;
}

export function removeLocalValue(key: string): void {
    window.localStorage.removeItem(key);
}

export function setSessionValue(key: string, value: any, stringify: boolean = true): void {
    if (stringify) {
        value = JSON.stringify(value);
    }
    window.sessionStorage.setItem(key, value);
}

export function getSessionValue(key: string, parseJson: boolean = true): any {
    let value = window.sessionStorage.getItem(key);
    if (parseJson) {
        try {
            value = JSON.parse(value!);
        } catch (e) {
            reportError('Error while parsing stored json value: ', e);
        }
    }

    return value;
}

export function removeSessionValue(key: string): void {
    window.sessionStorage.removeItem(key);
}

export function setCookie(name: string, value: string, options?: CookieOptions): void {
    let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
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

export function getCookie(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const ca = document.cookie.split(';');
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
