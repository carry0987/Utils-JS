import { version } from '@/component/version';
import { test, expect } from 'vitest';

test('version should be a string', () => {
    expect(typeof version).toBe('string');
});

test('version should have a placeholder value', () => {
    expect(version).toBe('__version__');
});
