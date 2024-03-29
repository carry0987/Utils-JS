declare const version: string;

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

type types_CombinedEventHandler = CombinedEventHandler;
type types_CombinedEventName = CombinedEventName;
type types_CustomEventHandler<T = unknown> = CustomEventHandler<T>;
type types_CustomEventName = CustomEventName;
type types_ElementAttributes = ElementAttributes;
type types_ElementEventTarget = ElementEventTarget;
type types_EventHandler<K extends EventName> = EventHandler<K>;
type types_EventName = EventName;
type types_EventOptions = EventOptions;
type types_Extension = Extension;
type types_QuerySelector = QuerySelector;
type types_RemoveEventOptions = RemoveEventOptions;
type types_ReplaceRule = ReplaceRule;
type types_StylesObject = StylesObject;
declare namespace types {
  export type { types_CombinedEventHandler as CombinedEventHandler, types_CombinedEventName as CombinedEventName, types_CustomEventHandler as CustomEventHandler, types_CustomEventName as CustomEventName, types_ElementAttributes as ElementAttributes, types_ElementEventTarget as ElementEventTarget, types_EventHandler as EventHandler, types_EventName as EventName, types_EventOptions as EventOptions, types_Extension as Extension, types_QuerySelector as QuerySelector, types_RemoveEventOptions as RemoveEventOptions, types_ReplaceRule as ReplaceRule, types_StylesObject as StylesObject };
}

declare let stylesheetId: string;
declare const replaceRule: ReplaceRule;
declare function isObject(item: unknown): item is Record<string, unknown>;
declare function deepMerge<T>(target: T, ...sources: Partial<T>[]): T;
declare function setStylesheetId(id: string): void;
declare function setReplaceRule(from: string, to: string): void;
declare function injectStylesheet(stylesObject: StylesObject, id?: string | null): void;
declare function buildRules(ruleObject: Record<string, string>): string;
declare function compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id?: string | null): void;
declare function removeStylesheet(id?: string | null): void;
declare function isEmpty(str: unknown): boolean;
declare function generateRandom(length?: number): string;
declare function getUrlParam(sParam: string, url?: string): string | null;

declare const common_buildRules: typeof buildRules;
declare const common_compatInsertRule: typeof compatInsertRule;
declare const common_deepMerge: typeof deepMerge;
declare const common_generateRandom: typeof generateRandom;
declare const common_getUrlParam: typeof getUrlParam;
declare const common_injectStylesheet: typeof injectStylesheet;
declare const common_isEmpty: typeof isEmpty;
declare const common_isObject: typeof isObject;
declare const common_removeStylesheet: typeof removeStylesheet;
declare const common_replaceRule: typeof replaceRule;
declare const common_setReplaceRule: typeof setReplaceRule;
declare const common_setStylesheetId: typeof setStylesheetId;
declare const common_stylesheetId: typeof stylesheetId;
declare namespace common {
  export { common_buildRules as buildRules, common_compatInsertRule as compatInsertRule, common_deepMerge as deepMerge, common_generateRandom as generateRandom, common_getUrlParam as getUrlParam, common_injectStylesheet as injectStylesheet, common_isEmpty as isEmpty, common_isObject as isObject, common_removeStylesheet as removeStylesheet, common_replaceRule as replaceRule, common_setReplaceRule as setReplaceRule, common_setStylesheetId as setStylesheetId, common_stylesheetId as stylesheetId };
}

declare function reportError(...error: any[]): void;
declare function throwError(message: string): never;

declare const errorUtils_reportError: typeof reportError;
declare const errorUtils_throwError: typeof throwError;
declare namespace errorUtils {
  export { errorUtils_reportError as reportError, errorUtils_throwError as throwError };
}

declare function getElem<E extends Element = Element>(ele: E, mode: 'all', parent?: QuerySelector): Array<E>;
declare function getElem<E extends Element = Element>(ele: string, mode: 'all', parent?: QuerySelector): NodeListOf<E>;
declare function getElem<E extends Element = Element>(ele: E, mode?: string | QuerySelector | null, parent?: QuerySelector): E;
declare function getElem<E extends Element = Element>(ele: string, mode?: string | QuerySelector | null, parent?: QuerySelector): E | null;
declare function createElem<K extends keyof HTMLElementTagNameMap>(tagName: K, attrs?: ElementAttributes, text?: string): HTMLElementTagNameMap[K];
declare function insertAfter(referenceNode: Node, newNode: Node | string): void;
declare function insertBefore(referenceNode: Node, newNode: Node | string): void;
declare function addClass(ele: Element, className: string): Element;
declare function removeClass(ele: Element, className: string): Element;
declare function toggleClass(ele: Element, className: string, force?: boolean | undefined): Element;
declare function hasClass(ele: Element, className: string): boolean;

declare const domUtils_addClass: typeof addClass;
declare const domUtils_createElem: typeof createElem;
declare const domUtils_getElem: typeof getElem;
declare const domUtils_hasClass: typeof hasClass;
declare const domUtils_insertAfter: typeof insertAfter;
declare const domUtils_insertBefore: typeof insertBefore;
declare const domUtils_removeClass: typeof removeClass;
declare const domUtils_toggleClass: typeof toggleClass;
declare namespace domUtils {
  export { domUtils_addClass as addClass, domUtils_createElem as createElem, domUtils_getElem as getElem, domUtils_hasClass as hasClass, domUtils_insertAfter as insertAfter, domUtils_insertBefore as insertBefore, domUtils_removeClass as removeClass, domUtils_toggleClass as toggleClass };
}

interface FetchOptions {
    url: string;
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit | Record<string, unknown>;
    beforeSend?: () => void;
    success?: (data: any) => void;
    error?: (error: any) => void;
}
interface FormDataOptions {
    data: Record<string, any>;
    parentKey?: string;
}
interface SendFormDataOptions {
    url: string;
    data: Record<string, any>;
    method?: string;
    beforeSend?: () => void;
    success?: (result: any) => void;
    errorCallback?: (error: any) => void;
}
interface CookieOptions {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

type interfaces_CookieOptions = CookieOptions;
type interfaces_FetchOptions = FetchOptions;
type interfaces_FormDataOptions = FormDataOptions;
type interfaces_SendFormDataOptions = SendFormDataOptions;
declare namespace interfaces {
  export type { interfaces_CookieOptions as CookieOptions, interfaces_FetchOptions as FetchOptions, interfaces_FormDataOptions as FormDataOptions, interfaces_SendFormDataOptions as SendFormDataOptions };
}

declare function setLocalValue(key: string, value: any, stringify?: boolean): void;
declare function getLocalValue(key: string, parseJson?: boolean): any;
declare function removeLocalValue(key: string): void;
declare function setSessionValue(key: string, value: any, stringify?: boolean): void;
declare function getSessionValue(key: string, parseJson?: boolean): any;
declare function removeSessionValue(key: string): void;
declare function setCookie(name: string, value: string, options?: CookieOptions): void;
declare function getCookie(name: string): string | null;
declare function removeCookie(name: string): void;

declare const storageUtils_getCookie: typeof getCookie;
declare const storageUtils_getLocalValue: typeof getLocalValue;
declare const storageUtils_getSessionValue: typeof getSessionValue;
declare const storageUtils_removeCookie: typeof removeCookie;
declare const storageUtils_removeLocalValue: typeof removeLocalValue;
declare const storageUtils_removeSessionValue: typeof removeSessionValue;
declare const storageUtils_setCookie: typeof setCookie;
declare const storageUtils_setLocalValue: typeof setLocalValue;
declare const storageUtils_setSessionValue: typeof setSessionValue;
declare namespace storageUtils {
  export { storageUtils_getCookie as getCookie, storageUtils_getLocalValue as getLocalValue, storageUtils_getSessionValue as getSessionValue, storageUtils_removeCookie as removeCookie, storageUtils_removeLocalValue as removeLocalValue, storageUtils_removeSessionValue as removeSessionValue, storageUtils_setCookie as setCookie, storageUtils_setLocalValue as setLocalValue, storageUtils_setSessionValue as setSessionValue };
}

declare function addEventListener<K extends EventName>(element: ElementEventTarget, eventName: K, handler: EventHandler<K>, options?: EventOptions): void;
declare function addEventListener<K extends CustomEventName>(element: ElementEventTarget, eventName: K, handler: CustomEventHandler, options?: EventOptions): void;
declare function removeEventListener<K extends EventName>(element: ElementEventTarget, eventName: K, handler: EventHandler<K>, options?: RemoveEventOptions): void;
declare function removeEventListener<K extends CustomEventName>(element: ElementEventTarget, eventName: K, handler: CustomEventHandler, options?: RemoveEventOptions): void;
declare function createEvent<T = unknown>(eventName: string, detail?: T, options?: EventInit): CustomEvent<T>;
declare function dispatchEvent<T = unknown>(eventOrName: string | Event, element?: Document | Element, detail?: T, options?: EventInit): boolean;

declare const eventUtils_addEventListener: typeof addEventListener;
declare const eventUtils_createEvent: typeof createEvent;
declare const eventUtils_dispatchEvent: typeof dispatchEvent;
declare const eventUtils_removeEventListener: typeof removeEventListener;
declare namespace eventUtils {
  export { eventUtils_addEventListener as addEventListener, eventUtils_createEvent as createEvent, eventUtils_dispatchEvent as dispatchEvent, eventUtils_removeEventListener as removeEventListener };
}

declare function doFetch<T>(options: FetchOptions): Promise<T>;
declare function sendData<T>(options: SendFormDataOptions): Promise<T>;
declare function sendFormData<T>(options: SendFormDataOptions): Promise<boolean>;

declare const fetchUtils_doFetch: typeof doFetch;
declare const fetchUtils_sendData: typeof sendData;
declare const fetchUtils_sendFormData: typeof sendFormData;
declare namespace fetchUtils {
  export { fetchUtils_doFetch as doFetch, fetchUtils_sendData as sendData, fetchUtils_sendFormData as sendFormData };
}

declare function appendFormData(options: FormDataOptions, formData?: FormData): FormData;
declare function encodeFormData(data: any, parentKey?: string): FormData;

declare const formUtils_appendFormData: typeof appendFormData;
declare const formUtils_encodeFormData: typeof encodeFormData;
declare namespace formUtils {
  export { formUtils_appendFormData as appendFormData, formUtils_encodeFormData as encodeFormData };
}

export { interfaces as Interfaces, types as Types, addClass, addEventListener, appendFormData, buildRules, common as commonUtils, compatInsertRule, createElem, createEvent, deepMerge, dispatchEvent, doFetch, domUtils, encodeFormData, errorUtils, eventUtils, fetchUtils, formUtils, generateRandom, getCookie, getElem, getLocalValue, getSessionValue, getUrlParam, hasClass, injectStylesheet, insertAfter, insertBefore, isEmpty, isObject, removeClass, removeCookie, removeEventListener, removeLocalValue, removeSessionValue, removeStylesheet, replaceRule, reportError, sendData, sendFormData, setCookie, setLocalValue, setReplaceRule, setSessionValue, setStylesheetId, storageUtils, stylesheetId, throwError, toggleClass, version };
