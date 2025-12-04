import { storageUtils, reportError } from '@/index';
import { describe, beforeEach, it, expect, vi } from 'vitest';

vi.mock('@/module/errorUtils', () => ({
    reportError: vi.fn()
}));

describe('storageUtils', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = '';
    });

    describe('LocalStorage', () => {
        it('setLocalValue stores a stringified value', () => {
            storageUtils.setLocalValue('testKey', { a: 1 });
            expect(localStorage.getItem('testKey')).toBe(JSON.stringify({ a: 1 }));
        });

        it('getLocalValue retrieves and parses a value', () => {
            localStorage.setItem('testKey', JSON.stringify({ a: 1 }));
            const value = storageUtils.getLocalValue('testKey');
            expect(value).toEqual({ a: 1 });
        });

        it('removeLocalValue removes the value', () => {
            localStorage.setItem('testKey', 'value');
            storageUtils.removeLocalValue('testKey');
            expect(localStorage.getItem('testKey')).toBeNull();
        });

        it('getLocalValue handles invalid JSON gracefully', () => {
            localStorage.setItem('testKey', 'invalid json');
            const value = storageUtils.getLocalValue('testKey');
            expect(value).toBe('invalid json');
            expect(reportError).toHaveBeenCalled();
        });

        it('getLocalValue returns raw string when parseJson is false', () => {
            localStorage.setItem('testKey', JSON.stringify({ a: 1 }));
            const value = storageUtils.getLocalValue('testKey', false);
            expect(value).toBe('{"a":1}');
        });

        it('getLocalValue returns null for non-existent key', () => {
            const value = storageUtils.getLocalValue('nonExistentKey');
            expect(value).toBeNull();
        });
    });

    describe('SessionStorage', () => {
        it('setSessionValue stores a stringified value', () => {
            storageUtils.setSessionValue('testKey', { a: 1 });
            expect(sessionStorage.getItem('testKey')).toBe(JSON.stringify({ a: 1 }));
        });

        it('getSessionValue retrieves and parses a value', () => {
            sessionStorage.setItem('testKey', JSON.stringify({ a: 1 }));
            const value = storageUtils.getSessionValue('testKey');
            expect(value).toEqual({ a: 1 });
        });

        it('removeSessionValue removes the value', () => {
            sessionStorage.setItem('testKey', 'value');
            storageUtils.removeSessionValue('testKey');
            expect(sessionStorage.getItem('testKey')).toBeNull();
        });

        it('getSessionValue handles invalid JSON gracefully', () => {
            sessionStorage.setItem('testKey', 'invalid json');
            const value = storageUtils.getSessionValue('testKey');
            expect(value).toBe('invalid json');
            expect(reportError).toHaveBeenCalled();
        });

        it('getSessionValue returns raw string when parseJson is false', () => {
            sessionStorage.setItem('testKey', JSON.stringify({ a: 1 }));
            const value = storageUtils.getSessionValue('testKey', false);
            expect(value).toBe('{"a":1}');
        });

        it('getSessionValue returns null for non-existent key', () => {
            const value = storageUtils.getSessionValue('nonExistentKey');
            expect(value).toBeNull();
        });
    });

    describe('Cookies', () => {
        it('setCookie sets a cookie', () => {
            storageUtils.setCookie('testCookie', 'testValue');
            expect(document.cookie).toContain('testCookie=testValue');
        });

        it('getCookie retrieves a cookie value', () => {
            expect(storageUtils.getCookie('testCookie')).toBe('testValue');
        });

        it('removeCookie removes the cookie', () => {
            storageUtils.removeCookie('testCookie');
            expect(document.cookie).not.toContain('testCookie=testValue');
        });
    });
});
