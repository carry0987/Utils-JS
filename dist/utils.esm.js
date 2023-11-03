/* Utils */
class Utils {
    constructor(extension) {
        Object.assign(this, extension);
    }
    static version = '2.1.7';
    static stylesheetId = 'utils-style';
    static replaceRule = {
        from: '.utils',
        to: '.utils-'
    };
    static setStylesheetId(id) {
        Utils.stylesheetId = id;
    }
    static setReplaceRule(from, to) {
        Utils.replaceRule.from = from;
        Utils.replaceRule.to = to;
    }
    static getElem(ele, mode, parent) {
        if (typeof ele === 'object') {
            return ele;
        }
        else if (mode === undefined && parent === undefined) {
            return isNaN(Number(ele)) ? document.querySelector(ele) : document.getElementById(ele);
        }
        else if (mode === 'all' || mode === null) {
            return parent === undefined ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
        }
        else if (typeof mode === 'object' && parent === undefined) {
            return mode.querySelector(ele);
        }
        return null;
    }
    static createElem(tagName, attrs = {}, text = '') {
        let elem = document.createElement(tagName);
        for (let attr in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
                if (attr === 'innerText') {
                    elem.textContent = attrs[attr];
                }
                else {
                    elem.setAttribute(attr, attrs[attr]);
                }
            }
        }
        if (text)
            elem.append(document.createTextNode(text));
        return elem;
    }
    static insertAfter(referenceNode, newNode) {
        if (typeof newNode === 'string') {
            let elem = Utils.createElem('div');
            elem.innerHTML = newNode;
            newNode = elem.firstChild;
        }
        if (referenceNode.nextSibling) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        else {
            referenceNode.parentNode.appendChild(newNode);
        }
    }
    static insertBefore(referenceNode, newNode) {
        if (typeof newNode === 'string') {
            let elem = Utils.createElem('div');
            elem.innerHTML = newNode;
            newNode = elem.firstChild;
        }
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }
    static addClass(ele, className) {
        ele.classList.add(className);
        return ele;
    }
    static removeClass(ele, className) {
        ele.classList.remove(className);
        return ele;
    }
    static toggleClass(ele, className) {
        ele.classList.toggle(className);
        return ele;
    }
    static hasClass(ele, className) {
        return ele.classList.contains(className);
    }
    static isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
    static deepMerge(target, ...sources) {
        if (!sources.length)
            return target;
        const source = sources.shift();
        if (source) {
            for (const key in source) {
                if (Utils.isObject(source[key])) {
                    if (!target[key])
                        target[key] = {};
                    Utils.deepMerge(target[key], source[key]);
                }
                else {
                    target[key] = source[key];
                }
            }
        }
        return Utils.deepMerge(target, ...sources);
    }
    // CSS Injection
    static injectStylesheet(stylesObject, id = null) {
        id = Utils.isEmpty(id) ? '' : id;
        // Create a style element
        let style = Utils.createElem('style');
        // WebKit hack
        style.id = Utils.stylesheetId + id;
        style.textContent = '';
        // Add the style element to the document head
        document.head.append(style);
        let stylesheet = style.sheet;
        for (let selector in stylesObject) {
            if (stylesObject.hasOwnProperty(selector)) {
                Utils.compatInsertRule(stylesheet, selector, Utils.buildRules(stylesObject[selector]), id);
            }
        }
    }
    static buildRules(ruleObject) {
        let ruleSet = '';
        for (let [property, value] of Object.entries(ruleObject)) {
            property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
            ruleSet += `${property}:${value};`;
        }
        return ruleSet;
    }
    static compatInsertRule(stylesheet, selector, cssText, id = null) {
        id = Utils.isEmpty(id) ? '' : id;
        let modifiedSelector = selector.replace(Utils.replaceRule.from, Utils.replaceRule.to + id);
        stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
    }
    static removeStylesheet(id = null) {
        id = Utils.isEmpty(id) ? '' : id;
        let styleElement = Utils.getElem('#' + Utils.stylesheetId + id);
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }
    }
    static isEmpty(str) {
        if (typeof str === 'number') {
            return false;
        }
        return !str || (typeof str === 'string' && str.length === 0);
    }
    static createEvent(eventName, detail = null) {
        return new CustomEvent(eventName, { detail });
    }
    static dispatchEvent(eventName, detail = null) {
        document.dispatchEvent(Utils.createEvent(eventName, detail));
    }
    static generateRandom(length = 8) {
        return Math.random().toString(36).substring(2, 2 + length);
    }
    static setLocalValue(key, value, stringify = true) {
        const pathPrefix = window.location.pathname.split('/')[1];
        if (stringify) {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(`${pathPrefix}-${key}`, value);
    }
    static getLocalValue(key, parseJson = true) {
        const pathPrefix = window.location.pathname.split('/')[1];
        let value = window.localStorage.getItem(`${pathPrefix}-${key}`);
        if (parseJson) {
            try {
                value = JSON.parse(value);
            }
            catch (e) {
                Utils.reportError('Error while parsing stored json value: ', e);
            }
        }
        return value;
    }
    static removeLocalValue(key) {
        const pathPrefix = window.location.pathname.split('/')[1];
        window.localStorage.removeItem(`${pathPrefix}-${key}`);
    }
    static setSessionValue(key, value, stringify = true) {
        if (stringify) {
            value = JSON.stringify(value);
        }
        window.sessionStorage.setItem(key, value);
    }
    static getSessionValue(key, parseJson = true) {
        let value = window.sessionStorage.getItem(key);
        if (parseJson) {
            try {
                value = JSON.parse(value);
            }
            catch (e) {
                Utils.reportError('Error while parsing stored json value: ', e);
            }
        }
        return value;
    }
    static removeSessionValue(key) {
        window.sessionStorage.removeItem(key);
    }
    static getUrlParameter(sParam, url = window.location.search) {
        let params = new URLSearchParams(url);
        let param = params.get(sParam);
        return param === null ? null : decodeURIComponent(param);
    }
    // Fetch API
    static async doFetch(options) {
        const { url, method = 'GET', headers = {}, body = null, beforeSend = null, success = null, error = null, } = options;
        let initHeaders = headers instanceof Headers ? headers : new Headers(headers);
        let init = {
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
            init.body = data;
        }
        let request = new Request(url, init);
        try {
            const createRequest = await new Promise((resolve) => {
                beforeSend?.();
                resolve(request);
            });
            const response = await fetch(createRequest);
            const responseData = await response.json();
            success?.(responseData);
            return responseData;
        }
        catch (caughtError) {
            error?.(caughtError);
            throw caughtError;
        }
    }
    // Append form data
    static appendFormData(options, formData = new FormData()) {
        const { data, parentKey = '' } = options;
        if (data !== null && typeof data === 'object') {
            // Check if it is Blob or File, if so, add directly
            if (data instanceof Blob || data instanceof File) {
                const formKey = parentKey || 'file'; // If no key is specified, the default is 'file'
                formData.append(formKey, data);
            }
            else {
                // Traverse object properties
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    const formKey = parentKey ? `${parentKey}[${key}]` : key;
                    if (value !== null && typeof value === 'object') {
                        // Recursively call to handle nested objects
                        Utils.appendFormData({ data: value, parentKey: formKey }, formData);
                    }
                    else if (value !== null) {
                        // Handle non-empty values, add directly
                        formData.append(formKey, String(value));
                    }
                });
            }
        }
        else if (data !== null) {
            // Non-object and non-null values, add directly
            formData.append(parentKey, data);
        }
        // If you don't want to add null values to FormData, you can do nothing here
        // Or if you want to convert null to other forms, you can handle it here
        return formData;
    }
    // Encode form data before send
    static encodeFormData(data, parentKey = '') {
        if (data instanceof FormData) {
            return data;
        }
        const options = {
            data: data,
            parentKey: parentKey
        };
        return Utils.appendFormData(options);
    }
    // Send form data
    static async sendFormData(options) {
        const { url, data, method = 'POST', success, errorCallback } = options;
        const fetchOptions = {
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
    static reportError(...error) {
        console.error(...error);
    }
    static throwError(message) {
        throw new Error(message);
    }
}
// Making the version property non-writable in TypeScript
Object.defineProperty(Utils, 'version', { writable: false, configurable: true });

export { Utils as default };
