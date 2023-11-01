/* Utils */
class Utils {
    constructor(extension) {
        Object.assign(this, extension);
    }
    static version = '2.1.0';
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
            if (attrs.hasOwnProperty(attr)) {
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
        const source = sources.shift();
        if (!source)
            return target;
        if (Utils.isObject(target) && Utils.isObject(source)) {
            for (const key in source) {
                if (Utils.isObject(source[key])) {
                    if (!target[key])
                        Object.assign(target, { [key]: {} });
                    Utils.deepMerge(target[key], source[key]);
                }
                else {
                    Object.assign(target, { [key]: source[key] });
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
        return (!str?.length);
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
        if (stringify) {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(key, value);
    }
    static getLocalValue(key, parseJson = true) {
        let value = window.localStorage.getItem(key);
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
        window.localStorage.removeItem(key);
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
