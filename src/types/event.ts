export type ElementEventTarget = Document | Element | Window | DocumentFragment | Node;
export type EventOptions = boolean | AddEventListenerOptions | undefined;
export type RemoveEventOptions = boolean | EventListenerOptions | undefined;
export type EventName = keyof HTMLElementEventMap;
export type EventHandler<K extends EventName> = (this: ElementEventTarget, ev: HTMLElementEventMap[K]) => unknown;
export type CustomEventName = string;
export type CustomEventHandler<T = unknown> = (this: ElementEventTarget, ev: CustomEvent<T>) => unknown;
export type CombinedEventName = EventName | CustomEventName;
export type CombinedEventHandler = EventHandler<EventName> | CustomEventHandler;
