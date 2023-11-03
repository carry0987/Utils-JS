/* Utils */
type Extension = Record<string, unknown>;

class Utils {
    constructor(extension: Extension) {
        Object.assign(this, extension);
    }

    static version: string = '__version__';
    static stylesheetId: string = 'utils-style';
    static replaceRule: { from: string, to: string } = {
        from: '.utils',
        to: '.utils-'
    };

    static setStylesheetId(id: string): void {
        Utils.stylesheetId = id;
    }

    static setReplaceRule(from: string, to: string): void {
        Utils.replaceRule.from = from;
        Utils.replaceRule.to = to;
    }

    static getElem(ele: string | Element, mode?: string | Element, parent?: Element): Element | NodeList | null {
        if (typeof ele === 'object') {
            return ele;
        } else if (mode === undefined && parent === undefined) {
            return isNaN(Number(ele)) ? document.querySelector(ele) : document.getElementById(ele);
        } else if (mode === 'all' || mode === null) {
            return parent === undefined ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
        } else if (typeof mode === 'object' && parent === undefined) {
            return mode.querySelector(ele);
        }
        return null;
    }

    static createElem(tagName: string, attrs: { [key: string]: unknown } = {}, text: string = ''): Element {
        let elem = document.createElement(tagName);
        for (let attr in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
                if (attr === 'innerText') {
                    elem.textContent = attrs[attr] as string;
                } else {
                    elem.setAttribute(attr, attrs[attr] as string);
                }
            }
        }
        if (text) elem.append(document.createTextNode(text));

        return elem;
    }

    static insertAfter(referenceNode: Node, newNode: Node | string): void {
        if (typeof newNode === 'string') {
            let elem = Utils.createElem('div');
            elem.innerHTML = newNode;
            newNode = elem.firstChild!;
        }
        if (referenceNode.nextSibling) {
            referenceNode.parentNode!.insertBefore(newNode, referenceNode.nextSibling);
        } else {
            referenceNode.parentNode!.appendChild(newNode);
        }
    }

    static insertBefore(referenceNode: Node, newNode: Node | string): void {
        if (typeof newNode === 'string') {
            let elem = Utils.createElem('div');
            elem.innerHTML = newNode;
            newNode = elem.firstChild!;
        }
        referenceNode.parentNode!.insertBefore(newNode, referenceNode);
    }

    static addClass(ele: Element, className: string): Element {
        ele.classList.add(className);
        return ele;
    }

    static removeClass(ele: Element, className: string): Element {
        ele.classList.remove(className);
        return ele;
    }

    static toggleClass(ele: Element, className: string): Element {
        ele.classList.toggle(className);
        return ele;
    }

    static hasClass(ele: Element, className: string): boolean {
        return ele.classList.contains(className);
    }

    static isObject(item: any): item is object {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    static deepMerge(target: { [key: string]: any }, ...sources: { [key: string]: any }[]): typeof target {
        if (!sources.length) return target;
        const source = sources.shift();
        if (source) {
            for (const key in source) {
                if (Utils.isObject(source[key])) {
                    if (!target[key]) target[key] = {};
                    Utils.deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return Utils.deepMerge(target, ...sources);
    }

    // CSS Injection
    static injectStylesheet(stylesObject: { [selector: string]: { [property: string]: string } }, id: string | null = null): void {
        id = Utils.isEmpty(id) ? '' : id;
        // Create a style element
        let style = Utils.createElem('style') as HTMLStyleElement;
        // WebKit hack
        style.id = Utils.stylesheetId + id;
        style.textContent = '';
        // Add the style element to the document head
        document.head.append(style);

        let stylesheet = style.sheet as CSSStyleSheet;

        for (let selector in stylesObject) {
            if (stylesObject.hasOwnProperty(selector)) {
                Utils.compatInsertRule(stylesheet, selector, Utils.buildRules(stylesObject[selector]), id);
            }
        }
    }

    static buildRules(ruleObject: { [property: string]: string }): string {
        let ruleSet = '';
        for (let [property, value] of Object.entries(ruleObject)) {
            property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
            ruleSet += `${property}:${value};`;
        }
        return ruleSet;
    }

    static compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id: string | null = null): void {
        id = Utils.isEmpty(id) ? '' : id;
        let modifiedSelector = selector.replace(Utils.replaceRule.from, Utils.replaceRule.to + id);
        stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
    }

    static removeStylesheet(id: string | null = null): void {
        id = Utils.isEmpty(id) ? '' : id;
        let styleElement = Utils.getElem('#' + Utils.stylesheetId + id) as Element;
        if (styleElement) {
            styleElement.parentNode!.removeChild(styleElement);
        }
    }

    static isEmpty(str: unknown): boolean {
        if (typeof str === 'number') {
            return false;
        }
        return !str || (typeof str === 'string' && str.length === 0);
    }

    static createEvent(eventName: string, detail: any = null): CustomEvent {
        return new CustomEvent(eventName, { detail });
    }

    static dispatchEvent(eventName: string, detail: any = null): void {
        document.dispatchEvent(Utils.createEvent(eventName, detail));
    }

    static generateRandom(length: number = 8): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    static setLocalValue(key: string, value: any, stringify = true): void {
        const pathPrefix = window.location.pathname.split('/')[1];
        if (stringify) {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(`${pathPrefix}-${key}`, value);
    }

    static getLocalValue(key: string, parseJson = true): any {
        const pathPrefix = window.location.pathname.split('/')[1];
        let value = window.localStorage.getItem(`${pathPrefix}-${key}`);
        if (parseJson) {
            try {
                value = JSON.parse(value!);
            } catch(e) {
                Utils.reportError('Error while parsing stored json value: ', e);
            }
        }

        return value;
    }

    static removeLocalValue(key: string): void {
        const pathPrefix = window.location.pathname.split('/')[1];
        window.localStorage.removeItem(`${pathPrefix}-${key}`);
    }

    static setSessionValue(key: string, value: any, stringify = true): void {
        if (stringify) {
            value = JSON.stringify(value);
        }
        window.sessionStorage.setItem(key, value);
    }

    static getSessionValue(key: string, parseJson = true): any {
        let value = window.sessionStorage.getItem(key);
        if (parseJson) {
            try {
                value = JSON.parse(value!);
            } catch(e) {
                Utils.reportError('Error while parsing stored json value: ', e);
            }
        }

        return value;
    }

    static removeSessionValue(key: string): void {
        window.sessionStorage.removeItem(key);
    }

    static reportError(...error: any[]): void {
        console.error(...error);
    }

    static throwError(message: string): void {
        throw new Error(message);
    }
}

// Making the version property non-writable in TypeScript
Object.defineProperty(Utils, 'version', { writable: false, configurable: true });

export default Utils;
