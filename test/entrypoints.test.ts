/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import * as browserUtils from '@/browser';
import * as rootUtils from '@/index';

describe('entrypoints', () => {
    it('imports root and browser entrypoints in node', () => {
        expect(typeof rootUtils.generateUUID).toBe('function');
        expect(typeof browserUtils.storageUtils.getLocalValue).toBe('function');
    });

    it('keeps browser-only namespaces out of the root entrypoint', () => {
        expect('storageUtils' in rootUtils).toBe(false);
        expect('domUtils' in rootUtils).toBe(false);
        expect('eventUtils' in rootUtils).toBe(false);
        expect('injectStylesheet' in rootUtils).toBe(false);
        expect('removeStylesheet' in rootUtils).toBe(false);
    });
});
