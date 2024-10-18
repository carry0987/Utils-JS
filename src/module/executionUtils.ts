/**
 * Throttle a given function
 *
 * @param fn Function to be called
 * @param wait Throttle timeout in milliseconds
 *
 * @returns Throttled function
 */
export function throttle(fn: (...args: any[]) => void, wait = 100) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastTime = Date.now();

    const execute = (...args: any[]) => {
        lastTime = Date.now();
        fn(...args);
    };

    return (...args: any[]) => {
        const currentTime = Date.now();
        const elapsed = currentTime - lastTime;

        if (elapsed >= wait) {
            // If enough time has passed since the last call, execute the function immediately
            execute(...args);
        } else {
            // If not enough time has passed, schedule the function call after the remaining delay
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                execute(...args);
                timeoutId = undefined;
            }, wait - elapsed);
        }
    };
}

/**
 * Creates a debounced function that delays the invocation of the provided function
 * until after the specified wait time has elapsed since the last time it was called.
 *
 * @param func - The original function to debounce.
 * @param waitFor - The number of milliseconds to delay the function call.
 *
 * @returns A debounced function that returns a Promise resolving to the result of the original function.
 */
export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
        new Promise((resolve) => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                resolve(func(...args));
                timeoutId = undefined; // Clear timeout after it's been executed
            }, waitFor);
        });
}
