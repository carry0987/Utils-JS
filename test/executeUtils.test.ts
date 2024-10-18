import { throttle, debounce } from '@/module/executeUtils';
import { describe, expect, test, vi } from 'vitest';

const sleep = (wait: number) => new Promise((r) => setTimeout(r, wait));

describe('throttle', () => {
    test('should throttle calls', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait);

        throttled('a', 'b', 'c');
        sleep(wait - 5);
        throttled('b', 'a', 'c');
        sleep(wait - 10);
        throttled('c', 'b', 'a');

        await sleep(wait);

        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith('c', 'b', 'a');
    });

    test('should execute the first call', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait);

        throttled();

        await sleep(wait);

        expect(fn).toBeCalledTimes(1);
    });

    test('should call at trailing edge of the timeout', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait);

        throttled();

        expect(fn).toBeCalledTimes(0);

        await sleep(wait);

        expect(fn).toBeCalledTimes(1);
    });

    test('should call after the timer', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait);

        throttled();
        await sleep(wait);

        expect(fn).toBeCalledTimes(1);

        throttled();
        await sleep(wait);

        expect(fn).toBeCalledTimes(2);

        throttled();
        await sleep(wait);

        expect(fn).toBeCalledTimes(3);
    });
});

describe('debounce', () => {
    test('should debounce a function', async () => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 100);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        expect(fn).toHaveBeenCalledTimes(0);

        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should resolve with the correct value', async () => {
        const fn = vi.fn((x: number) => x * 2);
        const debouncedFn = debounce(fn, 100);
        const promise = debouncedFn(21);

        await new Promise((resolve) => setTimeout(resolve, 150));

        await expect(promise).resolves.toBe(42);
    });

    test('should call the debounced function once after the wait period', async () => {
        const fn = vi.fn((x) => x * 2);
        const waitFor = 100;
        const debouncedFn = debounce(fn, waitFor);

        // Call the debounced function multiple times
        debouncedFn(1);
        debouncedFn(2);
        debouncedFn(3);

        // Wait for more than the debounce period
        await new Promise((resolve) => setTimeout(resolve, waitFor + 50));

        // The original function should be called only once
        expect(fn).toHaveBeenCalledOnce();

        // The result should be based on the last call
        expect(fn).toHaveBeenCalledWith(3);
    });

    test('should resolve with the result of the original function', async () => {
        const fn = vi.fn((x) => x + 1);
        const waitFor = 100;
        const debouncedFn = debounce(fn, waitFor);

        // Call the debounced function
        const result = await debouncedFn(5);

        // Check the result
        expect(result).toBe(6);
        expect(fn).toHaveBeenCalledOnce();
    });

    test('should clear the timeout on successive calls within the wait period', async () => {
        const fn = vi.fn((x) => x * 10);
        const waitFor = 100;
        const debouncedFn = debounce(fn, waitFor);

        // Call the debounced function at intervals less than waitFor
        debouncedFn(2);
        await new Promise((resolve) => setTimeout(resolve, 50));
        debouncedFn(3);

        // Wait for more than the debounce period after the last call
        await new Promise((resolve) => setTimeout(resolve, waitFor + 50));

        // The original function should be called with the last argument
        expect(fn).toHaveBeenCalledWith(3);
    });
});
