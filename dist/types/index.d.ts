type Extension = Record<string, unknown>;
type ReplaceRule = {
    from: string;
    to: string;
};
type ElementAttributes = Record<string, unknown>;
type StylesObject = Record<string, Record<string, string>>;
type QuerySelector = Element | Document | DocumentFragment;
type ElementEventTarget = Document | Element | Window | DocumentFragment | Node;
type EventOptions = boolean | AddEventListenerOptions | undefined;
type RemoveEventOptions = boolean | EventListenerOptions | undefined;
type EventName = keyof HTMLElementEventMap;
type EventHandler<K extends EventName> = (this: ElementEventTarget, ev: HTMLElementEventMap[K]) => any;
type CustomEventName = string;
type CustomEventHandler<T = unknown> = (this: ElementEventTarget, ev: CustomEvent<T>) => any;
type CombinedEventName = EventName | CustomEventName;
type CombinedEventHandler = EventHandler<EventName> | CustomEventHandler;

/** ------------------------------------------------------------------------
 * Type Utilities
 * ------------------------------------------------------------------------ */
/** DeepPartial: make all nested fields optional. */
type DeepPartial<T> = T extends Function ? T : T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T | undefined;
/** DeepReadonly: recursively make an object immutable. */
type DeepReadonly<T> = T extends (...args: any[]) => any ? T : T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;
/** RequireExactlyOne: enforce that only one key is provided. */
type RequireExactlyOne<T, Keys extends keyof T = keyof T> = {
    [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
}[Keys] & Omit<T, Keys>;

export type { CombinedEventHandler, CombinedEventName, CustomEventHandler, CustomEventName, DeepPartial, DeepReadonly, ElementAttributes, ElementEventTarget, EventHandler, EventName, EventOptions, Extension, QuerySelector, RemoveEventOptions, ReplaceRule, RequireExactlyOne, StylesObject };
