export type Extension = Record<string, unknown>;
export type ReplaceRule = { from: string; to: string };
export type ElementAttributes = Record<string, unknown>;
export type StylesObject = Record<string, Record<string, string>>;
export type QuerySelector = Element | Document | DocumentFragment;
// Event types
export type ElementEventTarget = Document | Element;
export type EventOptions = boolean | AddEventListenerOptions;
export type AddEventListenerParams<K extends Event = Event> = [
    element: ElementEventTarget,
    eventName: string,
    handler: (this: Element, ev: K) => any,
    options?: EventOptions
];

export type RemoveEventListenerParams<K extends Event = Event> = [
    element: ElementEventTarget,
    eventName: string,
    handler: (this: Element, ev: K) => any,
    options?: boolean | EventListenerOptions
];
