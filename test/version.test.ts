import { expect, it } from 'vitest';
import { version } from '@/component/version';

it('version should be a string', () => {
    expect(typeof version).toBe('string');
});

it('version should have a placeholder value', () => {
    expect(version).toBe('__version__');
});
