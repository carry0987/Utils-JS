declare class Utils {
    constructor(extension: any);
    static version: string;
    static stylesheetId: string;
    static replaceRule: {
        from: string;
        to: string;
    };
    static setStylesheetId(id: string): void;
    static setReplaceRule(from: string, to: string): void;
    static getElem(ele: string | Element, mode?: string | Element, parent?: Element): Element | NodeList | null;
    static createElem(tagName: string, attrs?: {
        [key: string]: any;
    }, text?: string): Element;
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
    static injectStylesheet(stylesObject: {
        [selector: string]: {
            [property: string]: string;
        };
    }, id?: string | null): void;
    static buildRules(ruleObject: {
        [property: string]: string;
    }): string;
    static compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id?: string | null): void;
    static removeStylesheet(id?: string | null): void;
    static isEmpty(str: any): boolean;
    static createEvent(eventName: string, detail?: any): CustomEvent;
    static dispatchEvent(eventName: string, detail?: any): void;
    static generateRandom(length?: number): string;
}

export { Utils as default };
