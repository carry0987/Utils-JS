import { Extension, ReplaceRule, ElementAttributes, StylesObject } from './types';
import { FetchOptions, FormDataOptions, SendFormDataOptions, CookieOptions } from './interfaces';

/* Utils */
class Utils {
    constructor(extension: Extension) {
        Object.assign(this, extension);
    }

    static version: string = '__version__';
    static stylesheetId: string = 'utils-style';
    static replaceRule: ReplaceRule = {
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
        } else if (mode === null) {
            return parent === undefined ? document.querySelector(ele) : parent.querySelector(ele);
        } else if (mode === 'all') {
            return parent === undefined ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
        } else if (typeof mode === 'object') {
            return mode.querySelector(ele);
        }
        return null;
    }

    static createElem(tagName: string, attrs: ElementAttributes = {}, text: string = ''): Element {
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
    static injectStylesheet(stylesObject: StylesObject, id: string | null = null): void {
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
        if (stringify) {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(key, value);
    }

    static getLocalValue(key: string, parseJson: boolean = true): any {
        let value = window.localStorage.getItem(key);
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
        window.localStorage.removeItem(key);
    }

    static setSessionValue(key: string, value: any, stringify: boolean = true): void {
        if (stringify) {
            value = JSON.stringify(value);
        }
        window.sessionStorage.setItem(key, value);
    }

    static getSessionValue(key: string, parseJson: boolean = true): any {
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

    static setCookie(name: string, value: string, options?: CookieOptions): void {
        let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
        const defaultOptions: CookieOptions = {
            expires: new Date(Date.now() + 86400000), // 1 day
            path: '/',
            secure: false,
            sameSite: 'Lax'
        };

        if (options) {
            options = Utils.deepMerge({}, defaultOptions, options);
        } else {
            options = defaultOptions;
        }

        if (options.expires) {
            let expiresValue: string | null = null;
            if (options.expires instanceof Date) {
                expiresValue = options.expires.toUTCString();
            } else {
                try {
                    expiresValue = new Date(options.expires).toUTCString();
                } catch (e) {
                    Utils.reportError('Invalid date string for cookie expiration:', e);
                }
            }
            cookieString += 'expires=' + expiresValue + ';';
        }
        if (options.path) {
            cookieString += 'path=' + options.path + ';';
        }
        if (options.domain) {
            cookieString += 'domain=' + options.domain + ';';
        }
        if (options.secure) {
            cookieString += 'secure;';
        }
        if (options.sameSite) {
            cookieString += 'SameSite=' + options.sameSite + ';';
        }

        document.cookie = cookieString;
    }

    static getCookie(name: string): string | null {
        const nameEQ = encodeURIComponent(name) + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    static deleteCookie(name: string): void {
        this.setCookie(name, '', { expires: new Date(0) });
    }

    static getUrlParameter(sParam: string, url: string = window.location.search): string | null {
        let params = new URLSearchParams(url);
        let param = params.get(sParam);
        return param === null ? null : decodeURIComponent(param);
    }

    // Fetch API
    static async doFetch(options: FetchOptions): Promise<any> {
        const {
            url,
            method = 'GET',
            headers = {},
            body = null,
            beforeSend = null,
            success = null,
            error = null,
        } = options;

        let initHeaders = headers instanceof Headers ? headers : new Headers(headers);
        let init: RequestInit = {
            method,
            mode: 'cors',
            headers: initHeaders
        };

        if (body !== null && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
            let data = body;
            if (!(body instanceof FormData)) {
                data = JSON.stringify(body);
                if (!(init.headers instanceof Headers)) {
                    init.headers = new Headers(init.headers);
                }
                init.headers.append('Content-Type', 'application/json');
            }
            init.body = data as BodyInit;
        }
        let request = new Request(url, init);
        try {
            const createRequest = await new Promise<Request>((resolve) => {
                beforeSend?.();
                resolve(request);
            });
            const response = await fetch(createRequest);
            const responseData = await response.json();
            success?.(responseData);
            return responseData;
        } catch (caughtError) {
            error?.(caughtError);
            throw caughtError;
        }
    }

    // Append form data
    static appendFormData(options: FormDataOptions, formData: FormData = new FormData()): FormData {
        const { data, parentKey = '' } = options;
        if (data !== null && typeof data === 'object') {
            // Check if it is Blob or File, if so, add directly
            if (data instanceof Blob || data instanceof File) {
                const formKey = parentKey || 'file'; // If no key is specified, the default is 'file'
                formData.append(formKey, data);
            } else {
                // Traverse object properties
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    const formKey = parentKey ? `${parentKey}[${key}]` : key;
                    if (value !== null && typeof value === 'object') {
                        // Recursively call to handle nested objects
                        Utils.appendFormData({ data: value, parentKey: formKey }, formData);
                    } else if (value !== null) {
                        // Handle non-empty values, add directly
                        formData.append(formKey, String(value));
                    }
                });
            }
        } else if (data !== null) {
            // Non-object and non-null values, add directly
            formData.append(parentKey, data);
        }
        // If you don't want to add null values to FormData, you can do nothing here
        // Or if you want to convert null to other forms, you can handle it here
        return formData;
    }

    // Encode form data before send
    static encodeFormData(data: any, parentKey: string = ''): FormData {
        if (data instanceof FormData) {
            return data;
        }
        const options: FormDataOptions = {
            data: data,
            parentKey: parentKey
        };
        return Utils.appendFormData(options);
    }

    // Send form data
    static async sendFormData(options: SendFormDataOptions): Promise<boolean> {
        const { url, data, method = 'POST', success, errorCallback } = options;

        const fetchOptions: FetchOptions = {
            url: url,
            method: method,
            body: Utils.encodeFormData(data),
            success: (responseData) => {
                if (success) {
                    success(responseData);
                }
            },
            error: (caughtError) => {
                if (errorCallback) {
                    errorCallback(caughtError);
                }
            }
        };

        return Utils.doFetch(fetchOptions)
            .then(() => true)
            .catch(() => false);
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
