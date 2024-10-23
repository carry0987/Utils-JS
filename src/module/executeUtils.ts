import { ThrottleOptions, DebounceOptions } from '@/interface/interfaces';

/**
 * Throttle a given function
 *
 * @param fn Function to be called
 * @param wait Throttle timeout in milliseconds
 * @param options Throttle options
 *
 * @returns Throttled function
 */
export function throttle(
    fn: (...args: any[]) => void,
    wait = 100,
    options: ThrottleOptions = { leading: false, trailing: true }
) {
    const { leading = false, trailing = true } = options;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastTime = leading ? -Infinity : Date.now();

    const invokeFn = (...args: any[]) => {
        lastTime = Date.now();
        fn(...args);
    };

    return (...args: any[]) => {
        const currentTime = Date.now();
        const elapsed = currentTime - lastTime;

        if (elapsed >= wait) {
            // Execute the function immediately, ensuring to clear any previous timer
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
            invokeFn(...args);
        } else if (trailing && timeoutId === undefined) {
            timeoutId = setTimeout(() => {
                invokeFn(...args);
                timeoutId = undefined;
            }, wait - elapsed);
        }
    };
}

/**
 * Creates a debounced function that delays the invocation of the provided function
 * until after the specified wait time has elapsed since the last time it was called.
 *
 * @param fn - The original function to debounce.
 * @param wait - The number of milliseconds to delay the function call.
 * @param options - Debounce options.
 *
 * @returns A debounced function that returns a Promise resolving to the result of the original function.
 */
export function debounce<F extends (...args: any[]) => any>(
    fn: F,
    wait: number,
    options: DebounceOptions = { leading: false, trailing: true }
) {
    const { leading = false, trailing = true, maxWait } = options;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastInvokeTime = 0;
    let result: ReturnType<F>;

    const invokeFn = (args: Parameters<F>): ReturnType<F> => {
        lastInvokeTime = Date.now();
        result = fn(...args);

        return result;
    };

    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
        new Promise((resolve) => {
            const currentTime = Date.now();
            const elapsed = currentTime - lastInvokeTime;

            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }

            if (maxWait !== undefined && elapsed >= maxWait) {
                resolve(invokeFn(args));
            } else if (leading && elapsed > wait) {
                resolve(invokeFn(args));
            }

            timeoutId = setTimeout(() => {
                if (trailing && !leading) {
                    resolve(invokeFn(args));
                }
                timeoutId = undefined; // Clear timeout after it's been executed
            }, wait);
        });
}
