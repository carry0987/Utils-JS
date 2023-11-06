export type Extension = Record<string, unknown>;
export type ReplaceRule = { from: string; to: string };
export type ElementAttributes = { [key: string]: unknown };
export type StylesObject = { [selector: string]: { [property: string]: string } };
// Event types
export type ElementEventTarget = Document | Element;
export type EventOptions = boolean | AddEventListenerOptions;
export type AddEventListenerParams = [
    element: ElementEventTarget,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: EventOptions
];
export type RemoveEventListenerParams = [
    element: ElementEventTarget,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
]
