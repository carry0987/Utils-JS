declare const version: string;

interface URLSource {
    url: string;
    ignore: Array<string> | string;
}
interface URLParams {
    [key: string]: string | number | boolean | null;
}
interface FetchParams<T = any> {
    url: string | Request | URL;
    method?: string;
    headers?: HeadersInit;
    cache?: RequestCache;
    mode?: RequestMode;
    credentials?: RequestCredentials;
    beforeSend?: () => void;
    success?: (data: T) => void;
    error?: (error: Error) => void;
}
interface FetchOptions<T = any> extends FetchParams<T> {
    body?: BodyInit | Record<string, unknown> | FormData | null;
}
interface SendFormDataOptions<T = any> extends FetchParams<T> {
    data?: Record<string, any> | Blob | File | FormData | null;
    encode?: boolean;
}
interface FormDataOptions {
    data: Record<string, any> | Blob | File | FormData | null;
    parentKey?: string;
}
interface CookieOptions {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}
interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}
interface DebounceOptions extends ThrottleOptions {
    maxWait?: number;
}

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

declare let stylesheetId: string;
declare const replaceRule: ReplaceRule;
declare function isDefined<T>(v: T): v is Exclude<T, null | undefined>;
declare function isObject(item: unknown): item is Record<string, unknown>;
declare function isFunction(item: unknown): item is Function;
declare function isString(item: unknown): item is string;
declare function isNumber(item: unknown): item is number;
declare function isBoolean(item: unknown): item is boolean;
declare function isArray(item: unknown): item is unknown[];
declare function isEmpty(value: unknown): boolean;
declare function assertNever(x: never, msg?: string): never;
declare function deepMerge<T>(target: T, ...sources: Partial<T>[]): T;
declare function shallowMerge<T>(target: T, ...sources: Partial<T>[]): T;
declare function deepClone<T>(obj: T): T;
declare function shallowClone<T>(obj: T): T;
declare function deepEqual<T>(obj1: T, obj2: T): boolean;
declare function shallowEqual<T>(obj1: T, obj2: T): boolean;
declare function setStylesheetId(id: string): void;
declare function setReplaceRule(from: string, to: string): void;
declare function injectStylesheet(stylesObject: StylesObject, id?: string | null): void;
declare function buildRules(ruleObject: Record<string, string>): string;
declare function compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id?: string | null): void;
declare function removeStylesheet(id?: string | null): void;
declare function generateRandom(length?: number): string;
declare function generateUUID(): string;
declare function isValidURL(url: string): boolean;
declare function getUrlParam(sParam: string, url?: string): string | null;
declare function getHashParam(sParam: string, url?: string): string | null;
declare function setUrlParam(url: string | URLSource, params: URLParams | null, overwrite?: boolean): string;
declare function setHashParam(url: string | URLSource, params: URLParams | null, overwrite?: boolean): string;

declare const common_assertNever: typeof assertNever;
declare const common_buildRules: typeof buildRules;
declare const common_compatInsertRule: typeof compatInsertRule;
declare const common_deepClone: typeof deepClone;
declare const common_deepEqual: typeof deepEqual;
declare const common_deepMerge: typeof deepMerge;
declare const common_generateRandom: typeof generateRandom;
declare const common_generateUUID: typeof generateUUID;
declare const common_getHashParam: typeof getHashParam;
declare const common_getUrlParam: typeof getUrlParam;
declare const common_injectStylesheet: typeof injectStylesheet;
declare const common_isArray: typeof isArray;
declare const common_isBoolean: typeof isBoolean;
declare const common_isDefined: typeof isDefined;
declare const common_isEmpty: typeof isEmpty;
declare const common_isFunction: typeof isFunction;
declare const common_isNumber: typeof isNumber;
declare const common_isObject: typeof isObject;
declare const common_isString: typeof isString;
declare const common_isValidURL: typeof isValidURL;
declare const common_removeStylesheet: typeof removeStylesheet;
declare const common_replaceRule: typeof replaceRule;
declare const common_setHashParam: typeof setHashParam;
declare const common_setReplaceRule: typeof setReplaceRule;
declare const common_setStylesheetId: typeof setStylesheetId;
declare const common_setUrlParam: typeof setUrlParam;
declare const common_shallowClone: typeof shallowClone;
declare const common_shallowEqual: typeof shallowEqual;
declare const common_shallowMerge: typeof shallowMerge;
declare const common_stylesheetId: typeof stylesheetId;
declare namespace common {
  export {
    common_assertNever as assertNever,
    common_buildRules as buildRules,
    common_compatInsertRule as compatInsertRule,
    common_deepClone as deepClone,
    common_deepEqual as deepEqual,
    common_deepMerge as deepMerge,
    common_generateRandom as generateRandom,
    common_generateUUID as generateUUID,
    common_getHashParam as getHashParam,
    common_getUrlParam as getUrlParam,
    common_injectStylesheet as injectStylesheet,
    common_isArray as isArray,
    common_isBoolean as isBoolean,
    common_isDefined as isDefined,
    common_isEmpty as isEmpty,
    common_isFunction as isFunction,
    common_isNumber as isNumber,
    common_isObject as isObject,
    common_isString as isString,
    common_isValidURL as isValidURL,
    common_removeStylesheet as removeStylesheet,
    common_replaceRule as replaceRule,
    common_setHashParam as setHashParam,
    common_setReplaceRule as setReplaceRule,
    common_setStylesheetId as setStylesheetId,
    common_setUrlParam as setUrlParam,
    common_shallowClone as shallowClone,
    common_shallowEqual as shallowEqual,
    common_shallowMerge as shallowMerge,
    common_stylesheetId as stylesheetId,
  };
}

declare function reportError(...error: any[]): void;
declare function throwError(message: string): never;

declare const errorUtils_reportError: typeof reportError;
declare const errorUtils_throwError: typeof throwError;
declare namespace errorUtils {
  export {
    errorUtils_reportError as reportError,
    errorUtils_throwError as throwError,
  };
}

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
declare function hasParent<E extends Element = Element>(ele: E, selector: string, maxDepth?: number): boolean;
declare function hasParent<E extends Element = Element>(ele: E, selector: string, maxDepth: number, returnElement: true): E | null;
declare function findParent<E extends Element = Element>(ele: E, selector: string): E | null;
declare function findParents<E extends Element = Element>(ele: E, selector: string, maxDepth?: number): E[];
declare function hasChild<E extends Element = Element>(ele: E, selector: string): boolean;
declare function findChild<E extends Element = Element>(ele: E, selector: string): E | null;
declare function findChilds<E extends Element = Element>(ele: E, selector: string, maxDepth?: number): E[];
declare function templateToHtml(templateElem: HTMLTemplateElement): string;
declare function templateToHtml(templateElem: DocumentFragment): string;

declare const domUtils_addClass: typeof addClass;
declare const domUtils_createElem: typeof createElem;
declare const domUtils_findChild: typeof findChild;
declare const domUtils_findChilds: typeof findChilds;
declare const domUtils_findParent: typeof findParent;
declare const domUtils_findParents: typeof findParents;
declare const domUtils_getElem: typeof getElem;
declare const domUtils_hasChild: typeof hasChild;
declare const domUtils_hasClass: typeof hasClass;
declare const domUtils_hasParent: typeof hasParent;
declare const domUtils_insertAfter: typeof insertAfter;
declare const domUtils_insertBefore: typeof insertBefore;
declare const domUtils_removeClass: typeof removeClass;
declare const domUtils_templateToHtml: typeof templateToHtml;
declare const domUtils_toggleClass: typeof toggleClass;
declare namespace domUtils {
  export {
    domUtils_addClass as addClass,
    domUtils_createElem as createElem,
    domUtils_findChild as findChild,
    domUtils_findChilds as findChilds,
    domUtils_findParent as findParent,
    domUtils_findParents as findParents,
    domUtils_getElem as getElem,
    domUtils_hasChild as hasChild,
    domUtils_hasClass as hasClass,
    domUtils_hasParent as hasParent,
    domUtils_insertAfter as insertAfter,
    domUtils_insertBefore as insertBefore,
    domUtils_removeClass as removeClass,
    domUtils_templateToHtml as templateToHtml,
    domUtils_toggleClass as toggleClass,
  };
}

declare function setLocalValue(key: string, value: any, stringify?: boolean): void;
declare function getLocalValue<T = any>(key: string, parseJson?: true): T | null;
declare function getLocalValue(key: string, parseJson: false): string | null;
declare function removeLocalValue(key: string): void;
declare function setSessionValue(key: string, value: any, stringify?: boolean): void;
declare function getSessionValue<T = any>(key: string, parseJson?: true): T | null;
declare function getSessionValue(key: string, parseJson: false): string | null;
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
  export {
    storageUtils_getCookie as getCookie,
    storageUtils_getLocalValue as getLocalValue,
    storageUtils_getSessionValue as getSessionValue,
    storageUtils_removeCookie as removeCookie,
    storageUtils_removeLocalValue as removeLocalValue,
    storageUtils_removeSessionValue as removeSessionValue,
    storageUtils_setCookie as setCookie,
    storageUtils_setLocalValue as setLocalValue,
    storageUtils_setSessionValue as setSessionValue,
  };
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
  export {
    eventUtils_addEventListener as addEventListener,
    eventUtils_createEvent as createEvent,
    eventUtils_dispatchEvent as dispatchEvent,
    eventUtils_removeEventListener as removeEventListener,
  };
}

/**
 * Throttle a given function
 *
 * @param fn Function to be called
 * @param wait Throttle timeout in milliseconds
 * @param options Throttle options
 *
 * @returns Throttled function
 */
declare function throttle(fn: (...args: any[]) => void, wait?: number, options?: ThrottleOptions): (...args: any[]) => void;
/**
 * Creates a debounced function that delays the invocation of the provided function
 * until after the specified wait time has elapsed since the last time it was called.
 *
 * @param fn - The original function to debounce.
 * @param wait - The number of milliseconds to delay the function call.
 * @param options - Debounce options.
 *
 * @returns A debounced function that returns a Promise resolving to the result of the original function.
 */
declare function debounce<F extends (...args: any[]) => any>(fn: F, wait: number, options?: DebounceOptions): (...args: Parameters<F>) => Promise<ReturnType<F>>;

declare const executeUtils_debounce: typeof debounce;
declare const executeUtils_throttle: typeof throttle;
declare namespace executeUtils {
  export {
    executeUtils_debounce as debounce,
    executeUtils_throttle as throttle,
  };
}

declare function doFetch<T>(options: FetchOptions<T>): Promise<Response>;
declare function sendData<T>(options: SendFormDataOptions<T>): Promise<T>;
declare function sendFormData<T>(options: SendFormDataOptions<T>): Promise<boolean>;
declare const fetchData: typeof sendData;
declare const sendForm: typeof sendFormData;

declare const fetchUtils_doFetch: typeof doFetch;
declare const fetchUtils_fetchData: typeof fetchData;
declare const fetchUtils_sendData: typeof sendData;
declare const fetchUtils_sendForm: typeof sendForm;
declare const fetchUtils_sendFormData: typeof sendFormData;
declare namespace fetchUtils {
  export {
    fetchUtils_doFetch as doFetch,
    fetchUtils_fetchData as fetchData,
    fetchUtils_sendData as sendData,
    fetchUtils_sendForm as sendForm,
    fetchUtils_sendFormData as sendFormData,
  };
}

declare function appendFormData(options: FormDataOptions, formData?: FormData): FormData;
declare function encodeFormData(data: any, parentKey?: string): FormData;
declare function decodeFormData(formData: FormData): Record<string, any>;
declare function formDataToURLParams(formData: FormData): URLParams;
declare function bodyToURLParams(body: FormData | BodyInit | Record<string, unknown>): URLParams;

declare const formUtils_appendFormData: typeof appendFormData;
declare const formUtils_bodyToURLParams: typeof bodyToURLParams;
declare const formUtils_decodeFormData: typeof decodeFormData;
declare const formUtils_encodeFormData: typeof encodeFormData;
declare const formUtils_formDataToURLParams: typeof formDataToURLParams;
declare namespace formUtils {
  export {
    formUtils_appendFormData as appendFormData,
    formUtils_bodyToURLParams as bodyToURLParams,
    formUtils_decodeFormData as decodeFormData,
    formUtils_encodeFormData as encodeFormData,
    formUtils_formDataToURLParams as formDataToURLParams,
  };
}

export { addClass, addEventListener, appendFormData, assertNever, bodyToURLParams, buildRules, common as commonUtils, compatInsertRule, createElem, createEvent, debounce, decodeFormData, deepClone, deepEqual, deepMerge, dispatchEvent, doFetch, domUtils, encodeFormData, errorUtils, eventUtils, executeUtils, fetchData, fetchUtils, findChild, findChilds, findParent, findParents, formDataToURLParams, formUtils, generateRandom, generateUUID, getCookie, getElem, getHashParam, getLocalValue, getSessionValue, getUrlParam, hasChild, hasClass, hasParent, injectStylesheet, insertAfter, insertBefore, isArray, isBoolean, isDefined, isEmpty, isFunction, isNumber, isObject, isString, isValidURL, removeClass, removeCookie, removeEventListener, removeLocalValue, removeSessionValue, removeStylesheet, replaceRule, reportError, sendData, sendForm, sendFormData, setCookie, setHashParam, setLocalValue, setReplaceRule, setSessionValue, setStylesheetId, setUrlParam, shallowClone, shallowEqual, shallowMerge, storageUtils, stylesheetId, templateToHtml, throttle, throwError, toggleClass, version };
