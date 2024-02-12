export type Extension = Record<string, unknown>;
export type ReplaceRule = { from: string; to: string };
export type ElementAttributes = Record<string, unknown>;
export type StylesObject = Record<string, Record<string, string>>;
export type QuerySelector = Element | Document | DocumentFragment;
// Event types
export type ElementEventTarget = Document | Element;
export type EventOptions = boolean | AddEventListenerOptions;
export type RemoveEventOptions = boolean | EventListenerOptions;
