/** ------------------------------------------------------------------------
 * Type Utilities
 * ------------------------------------------------------------------------ */

export * from './common';
export * from './dom';
export * from './event';
export * from './execute';
export * from './fetch';
export * from './form';
export * from './storage';
export * from './style';

type UnknownFunction = (...args: never[]) => unknown;

/** DeepPartial: make all nested fields optional. */
export type DeepPartial<T> = T extends UnknownFunction
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T | undefined;

/** DeepReadonly: recursively make an object immutable. */
export type DeepReadonly<T> = T extends UnknownFunction
    ? T
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

/** RequireExactlyOne: enforce that only one key is provided. */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = {
    [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
}[Keys] &
    Omit<T, Keys>;
