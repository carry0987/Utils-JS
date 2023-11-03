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

interface FormDataOptions {
    data: Record<string, any>;
    parentKey?: string;
}

declare class Utils {
    constructor(extension: Extension);
    static version: string;
    static stylesheetId: string;
    static replaceRule: ReplaceRule;
    static setStylesheetId(id: string): void;
    static setReplaceRule(from: string, to: string): void;
    static getElem(ele: string | Element, mode?: string | Element, parent?: Element): Element | NodeList | null;
    static createElem(tagName: string, attrs?: ElementAttributes, text?: string): Element;
    static insertAfter(referenceNode: Node, newNode: Node | string): void;
    static insertBefore(referenceNode: Node, newNode: Node | string): void;
    static addClass(ele: Element, className: string): Element;
    static removeClass(ele: Element, className: string): Element;
    static toggleClass(ele: Element, className: string): Element;
    static hasClass(ele: Element, className: string): boolean;
    static isObject(item: any): item is object;
    static deepMerge(target: {
        [key: string]: any;
    }, ...sources: {
        [key: string]: any;
    }[]): typeof target;
    static injectStylesheet(stylesObject: StylesObject, id?: string | null): void;
    static buildRules(ruleObject: {
        [property: string]: string;
    }): string;
    static compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id?: string | null): void;
    static removeStylesheet(id?: string | null): void;
    static isEmpty(str: unknown): boolean;
    static createEvent(eventName: string, detail?: any): CustomEvent;
    static dispatchEvent(eventName: string, detail?: any): void;
    static generateRandom(length?: number): string;
    static setLocalValue(key: string, value: any, stringify?: boolean): void;
    static getLocalValue(key: string, parseJson?: boolean): any;
    static removeLocalValue(key: string): void;
    static setSessionValue(key: string, value: any, stringify?: boolean): void;
    static getSessionValue(key: string, parseJson?: boolean): any;
    static removeSessionValue(key: string): void;
    static getUrlParameter(sParam: string, url?: string): string | null;
    static appendFormData(options: FormDataOptions, formData?: FormData): FormData;
    static encodeFormData(options: FormDataOptions): FormData;
    static reportError(...error: any[]): void;
    static throwError(message: string): void;
}

export { Utils as default };
