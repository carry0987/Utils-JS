export type ThrottleOptions = {
    leading?: boolean;
    trailing?: boolean;
};

export type DebounceOptions = ThrottleOptions & {
    maxWait?: number;
};
