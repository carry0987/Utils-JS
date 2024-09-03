import { describe, beforeEach, test, expect, vi } from 'vitest';
import { storageUtils, reportError } from '../src/index';

vi.mock('../src/module/errorUtils', () => ({
    reportError: vi.fn()
}));

describe('storageUtils', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = '';
    });

    describe('LocalStorage', () => {
        test('setLocalValue stores a stringified value', () => {
            storageUtils.setLocalValue('testKey', { a: 1 });
            expect(localStorage.getItem('testKey')).toBe(JSON.stringify({ a: 1 }));
        });

        test('getLocalValue retrieves and parses a value', () => {
            localStorage.setItem('testKey', JSON.stringify({ a: 1 }));
            const value = storageUtils.getLocalValue('testKey');
            expect(value).toEqual({ a: 1 });
        });

        test('removeLocalValue removes the value', () => {
            localStorage.setItem('testKey', 'value');
            storageUtils.removeLocalValue('testKey');
            expect(localStorage.getItem('testKey')).toBeNull();
        });

        test('getLocalValue handles invalid JSON gracefully', () => {
            localStorage.setItem('testKey', 'invalid json');
            const value = storageUtils.getLocalValue('testKey');
            expect(value).toBe('invalid json');
            expect(reportError).toHaveBeenCalled();
        });
    });

    describe('SessionStorage', () => {
        test('setSessionValue stores a stringified value', () => {
            storageUtils.setSessionValue('testKey', { a: 1 });
            expect(sessionStorage.getItem('testKey')).toBe(JSON.stringify({ a: 1 }));
        });

        test('getSessionValue retrieves and parses a value', () => {
            sessionStorage.setItem('testKey', JSON.stringify({ a: 1 }));
            const value = storageUtils.getSessionValue('testKey');
            expect(value).toEqual({ a: 1 });
        });

        test('removeSessionValue removes the value', () => {
            sessionStorage.setItem('testKey', 'value');
            storageUtils.removeSessionValue('testKey');
            expect(sessionStorage.getItem('testKey')).toBeNull();
        });

        test('getSessionValue handles invalid JSON gracefully', () => {
            sessionStorage.setItem('testKey', 'invalid json');
            const value = storageUtils.getSessionValue('testKey');
            expect(value).toBe('invalid json');
            expect(reportError).toHaveBeenCalled();
        });
    });

    describe('Cookies', () => {
        test('setCookie sets a cookie', () => {
            storageUtils.setCookie('testCookie', 'testValue');
            expect(document.cookie).toContain('testCookie=testValue');
        });

        test('getCookie retrieves a cookie value', () => {
            expect(storageUtils.getCookie('testCookie')).toBe('testValue');
        });

        test('removeCookie removes the cookie', () => {
            storageUtils.removeCookie('testCookie');
            expect(document.cookie).not.toContain('testCookie=testValue');
        });
    });
});
