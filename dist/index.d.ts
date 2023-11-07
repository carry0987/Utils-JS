type Extension = Record<string, unknown>;
type ReplaceRule = {
    from: string;
    to: string;
};
type ElementAttributes = {
    [key: string]: unknown;
};
type StylesObject = {
    [selector: string]: {
        [property: string]: string;
    };
};
type ElementEventTarget = Document | Element;
type EventOptions = boolean | AddEventListenerOptions;
type AddEventListenerParams = [
    element: ElementEventTarget,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: EventOptions
];
type RemoveEventListenerParams = [
    element: ElementEventTarget,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
];

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

declare class Utils {
    constructor(extension: Extension);
    static version: string;
    static stylesheetId: string;
    static replaceRule: ReplaceRule;
    static setStylesheetId(id: string): void;
    static setReplaceRule(from: string, to: string): void;
    static getElem(ele: string | Element, mode?: string | Element | null, parent?: Element): Element | NodeList | null;
    static createElem(tagName: string, attrs?: ElementAttributes, text?: string): Element;
    static insertAfter(referenceNode: Node, newNode: Node | string): void;
    static insertBefore(referenceNode: Node, newNode: Node | string): void;
    static addClass(ele: Element, className: string): Element;
    static removeClass(ele: Element, className: string): Element;
    static toggleClass(ele: Element, className: string): Element;
    static hasClass(ele: Element, className: string): boolean;
    static isObject(item: unknown): item is Record<string, unknown>;
    static deepMerge<T>(target: T, ...sources: Partial<T>[]): T;
    static injectStylesheet(stylesObject: StylesObject, id?: string | null): void;
    static buildRules(ruleObject: {
        [property: string]: string;
    }): string;
    static compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id?: string | null): void;
    static removeStylesheet(id?: string | null): void;
    static isEmpty(str: unknown): boolean;
    static createEvent(eventName: string, detail?: any, options?: EventInit): CustomEvent;
    static dispatchEvent(eventOrName: string | Event, element?: Document | Element, detail?: any, options?: EventInit): boolean;
    static addEventListener(...params: AddEventListenerParams): void;
    static removeEventListener(...params: RemoveEventListenerParams): void;
    static generateRandom(length?: number): string;
    static setLocalValue(key: string, value: any, stringify?: boolean): void;
    static getLocalValue(key: string, parseJson?: boolean): any;
    static removeLocalValue(key: string): void;
    static setSessionValue(key: string, value: any, stringify?: boolean): void;
    static getSessionValue(key: string, parseJson?: boolean): any;
    static removeSessionValue(key: string): void;
    static setCookie(name: string, value: string, options?: CookieOptions): void;
    static getCookie(name: string): string | null;
    static deleteCookie(name: string): void;
    static getUrlParameter(sParam: string, url?: string): string | null;
    static doFetch(options: FetchOptions): Promise<any>;
    static appendFormData(options: FormDataOptions, formData?: FormData): FormData;
    static encodeFormData(data: any, parentKey?: string): FormData;
    static sendFormData(options: SendFormDataOptions): Promise<boolean>;
    static reportError(...error: any[]): void;
    static throwError(message: string): void;
}

export { Utils as default };
