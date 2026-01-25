import { throttle, debounce } from '@/module/executeUtils';
import { describe, expect, it, vi } from 'vitest';

const sleep = (wait: number) => new Promise((r) => setTimeout(r, wait));

describe('throttle', () => {
    it('should throttle calls and respect trailing', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait);

        throttled('a', 'b', 'c');
        await sleep(wait - 5);
        throttled('b', 'a', 'c');
        await sleep(wait - 10);
        throttled('c', 'b', 'a');

        await sleep(wait + 10); // Ensure we've waited long enough for it to be called twice

        // The function should be called twice due to trailing
        expect(fn).toBeCalledTimes(2);
        // The last call to the throttled function should use the last set of arguments
        expect(fn).toBeCalledWith('c', 'b', 'a');
    });

    it('should execute the first call immediately if leading is set', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait, { leading: true });

        throttled();

        expect(fn).toBeCalledTimes(1);

        await sleep(wait);

        expect(fn).toBeCalledTimes(1);
    });

    it('should execute at trailing edge of the timeout', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait);

        throttled();

        expect(fn).toBeCalledTimes(0);

        await sleep(wait + 10);

        expect(fn).toBeCalledTimes(1);
    });

    it('should call after successive calls with delay', async () => {
        const wait = 100;
        const fn = vi.fn();
        const throttled = throttle(fn, wait);

        throttled();
        await sleep(wait + 10);

        expect(fn).toBeCalledTimes(1);

        throttled();
        await sleep(wait + 10);

        expect(fn).toBeCalledTimes(2);

        throttled();
        await sleep(wait + 10);

        expect(fn).toBeCalledTimes(3);
    });
});

describe('debounce', () => {
    it('should debounce a function', async () => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 100);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        expect(fn).toHaveBeenCalledTimes(0);

        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should resolve with the correct value', async () => {
        const fn = vi.fn((x: number) => x * 2);
        const debouncedFn = debounce(fn, 100);
        const promise = debouncedFn(21);

        await new Promise((resolve) => setTimeout(resolve, 150));

        await expect(promise).resolves.toBe(42);
    });

    it('should call the debounced function once after the wait period', async () => {
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

    it('should resolve with the result of the original function', async () => {
        const fn = vi.fn((x) => x + 1);
        const waitFor = 100;
        const debouncedFn = debounce(fn, waitFor);

        // Call the debounced function
        const result = await debouncedFn(5);

        // Check the result
        expect(result).toBe(6);
        expect(fn).toHaveBeenCalledOnce();
    });

    it('should clear the timeout on successive calls within the wait period', async () => {
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

    it('should resolve all pending promises with the same final result', async () => {
        const fn = vi.fn((x: number) => x * 2);
        const wait = 100;
        const debouncedFn = debounce(fn, wait);

        const p1 = debouncedFn(1);
        const p2 = debouncedFn(2);
        const p3 = debouncedFn(3);

        await sleep(wait + 50);

        const results = await Promise.all([p1, p2, p3]);
        expect(results).toEqual([6, 6, 6]);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(3);
    });

    it('should respect maxWait option', async () => {
        const fn = vi.fn((x: number) => x);
        const wait = 100;
        const maxWait = 150;
        const debouncedFn = debounce(fn, wait, { maxWait });

        // First call
        debouncedFn(1);

        // Call again at 80ms (less than wait=100)
        await sleep(80);
        debouncedFn(2);

        // Call again at 160ms (Total time since first call is 160ms, which is > maxWait=150)
        // This should trigger the invoke immediately because of maxWait
        await sleep(80);
        debouncedFn(3);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(3);

        // Final wait to ensure no extra calls
        await sleep(wait + 50);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
