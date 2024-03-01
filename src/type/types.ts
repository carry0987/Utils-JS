export type Extension = Record<string, unknown>;
export type ReplaceRule = { from: string; to: string };
export type ElementAttributes = Record<string, unknown>;
export type StylesObject = Record<string, Record<string, string>>;
export type QuerySelector = Element | Document | DocumentFragment;
// Event types
export type ElementEventTarget = Document | Element;
export type EventOptions = boolean | AddEventListenerOptions | undefined;
export type RemoveEventOptions = boolean | EventListenerOptions | undefined;
export type EventName = keyof HTMLElementEventMap;
export type EventHandler<K extends EventName> = (this: ElementEventTarget, ev: HTMLElementEventMap[K]) => any;
export type CustomEventName = string;
export type CustomEventHandler<T = unknown> = (this: ElementEventTarget, ev: CustomEvent<T>) => any;
export type CombinedEventName = EventName | CustomEventName;
export type CombinedEventHandler = EventHandler<EventName> | CustomEventHandler;
