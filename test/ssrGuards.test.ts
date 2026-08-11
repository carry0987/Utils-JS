/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from 'vitest';
import { commonUtils as browserCommonUtils, domUtils, eventUtils, storageUtils } from '@/browser';
import { commonUtils } from '@/index';

describe('SSR guards', () => {
    it('returns null instead of touching browser storage in node', () => {
        expect(storageUtils.getLocalValue('missing')).toBeNull();
        expect(storageUtils.getSessionValue('missing')).toBeNull();
        expect(storageUtils.getCookie('missing')).toBeNull();
    });

    it('no-ops browser storage mutators in node', () => {
        expect(() => storageUtils.setLocalValue('key', { ok: true })).not.toThrow();
        expect(() => storageUtils.removeLocalValue('key')).not.toThrow();
        expect(() => storageUtils.setSessionValue('key', { ok: true })).not.toThrow();
        expect(() => storageUtils.removeSessionValue('key')).not.toThrow();
        expect(() => storageUtils.setCookie('token', 'value')).not.toThrow();
        expect(() => storageUtils.removeCookie('token')).not.toThrow();
    });

    it('returns null for implicit location lookups in node', () => {
        expect(commonUtils.getUrlParam('page')).toBeNull();
        expect(commonUtils.getHashParam('tab')).toBeNull();
        expect(commonUtils.getHashParam()).toBeNull();
    });

    it('no-ops stylesheet helpers in node', () => {
        expect(() => browserCommonUtils.injectStylesheet({ '.demo': { color: 'red' } })).not.toThrow();
        expect(() => browserCommonUtils.removeStylesheet()).not.toThrow();
    });

    it('throws controlled errors for DOM-only helpers in node', () => {
        expect(() => domUtils.getElem('#demo')).toThrow('DOM utilities require a browser document');
        expect(() => domUtils.createElem('div')).toThrow('DOM utilities require a browser document');
    });

    it('returns false when dispatch has no server-side target', () => {
        const reportErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(eventUtils.dispatchEvent('server-only')).toBe(false);
        expect(reportErrorSpy).toHaveBeenCalled();

        reportErrorSpy.mockRestore();
    });
});
