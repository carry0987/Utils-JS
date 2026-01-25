import { ThrottleOptions, DebounceOptions } from '@/interfaces/internal';

/**
 * Creates a throttled function that only invokes the provided function at most once
 * per every wait milliseconds.
 *
 * @param fn - The function to throttle.
 * @param wait - The number of milliseconds to throttle invocations to.
 * @param options - Throttle options.
 *
 * @returns The new throttled function.
 */
export function throttle<F extends (...args: any[]) => void>(
    fn: F,
    wait = 100,
    options: ThrottleOptions = { leading: false, trailing: true }
) {
    const { leading = false, trailing = true } = options;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastTime = leading ? 0 : performance.now();
    let lastArgs: Parameters<F> | undefined;

    const invokeFn = () => {
        if (lastArgs) {
            lastTime = performance.now();
            fn(...lastArgs);
            lastArgs = undefined;
        }
    };

    return (...args: Parameters<F>) => {
        const currentTime = performance.now();
        lastArgs = args; // Always store the latest arguments

        const elapsed = currentTime - lastTime;

        if (elapsed >= wait) {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
            invokeFn();
        } else if (trailing && timeoutId === undefined) {
            timeoutId = setTimeout(() => {
                invokeFn();
                timeoutId = undefined;
            }, wait - elapsed);
        }
    };
}

/**
 * Creates a debounced function that delays invocation until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param fn - The function to debounce.
 * @param wait - The number of milliseconds to delay.
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
    let lastCallTime = 0;
    let lastArgs: Parameters<F> | undefined;

    /** Collection of resolvers to prevent Promise hanging for cancelled calls */
    let pendingResolvers: ((value: ReturnType<F>) => void)[] = [];

    const invokeFn = (): ReturnType<F> => {
        if (!lastArgs) {
            // This should ideally never happen given the logic,
            // but added for type safety and rigor.
            throw new Error('Debounce invoked without arguments');
        }
        const result = fn(...lastArgs);
        lastInvokeTime = performance.now();

        // Resolve all pending promises with the latest result
        const resolvers = [...pendingResolvers];
        pendingResolvers = [];
        for (const resolve of resolvers) {
            resolve(result);
        }

        return result;
    };

    return (...args: Parameters<F>): Promise<ReturnType<F>> => {
        return new Promise((resolve) => {
            const currentTime = performance.now();
            const isFirstCallInBurst = timeoutId === undefined;
            lastArgs = args;
            pendingResolvers.push(resolve);

            if (isFirstCallInBurst) {
                lastCallTime = currentTime;
            }

            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }

            // Execute immediately if leading and wait time has passed
            if (leading && isFirstCallInBurst && (currentTime - lastInvokeTime > wait || lastInvokeTime === 0)) {
                return invokeFn();
            }

            // Execute if maxWait is reached
            if (maxWait !== undefined && currentTime - lastCallTime >= maxWait) {
                return invokeFn();
            }

            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                if (trailing) {
                    invokeFn();
                }
            }, wait);
        });
    };
}
