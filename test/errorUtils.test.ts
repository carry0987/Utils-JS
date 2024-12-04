import { errorUtils } from '@/index';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

describe('errorUtils', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('reportError should call console.error with the provided arguments', () => {
        const errorArgs = ['Test error message', { code: 500 }];
        errorUtils.reportError(...errorArgs);

        expect(console.error).toHaveBeenCalledWith(...errorArgs);
    });

    it('throwError should throw an error with the provided message', () => {
        const errorMessage = 'Test error';

        expect(() => {
            errorUtils.throwError(errorMessage);
        }).toThrow(Error);

        expect(() => {
            errorUtils.throwError(errorMessage);
        }).toThrow(errorMessage);
    });
});
