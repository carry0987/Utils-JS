/* Utils */
class Utils {
    constructor(extension: any) {
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

    static createElem(tagName: string, attrs: { [key: string]: any } = {}, text: string = ''): Element {
        let elem = document.createElement(tagName);
        for (let attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                if (attr === 'innerText') {
                    elem.textContent = attrs[attr];
                } else {
                    elem.setAttribute(attr, attrs[attr]);
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
        const source = sources.shift();
        if (!source) return target;
        if (Utils.isObject(target) && Utils.isObject(source)) {
            for (const key in source) {
                if (Utils.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    Utils.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return Utils.deepMerge(target, ...sources);
    }

    static injectStylesheet(stylesObject: { [selector: string]: { [property: string]: string } }, id: string | null = null): void {
        id = Utils.isEmpty(id) ? '' : id;
        let style = Utils.createElem('style') as HTMLStyleElement;
        style.id = Utils.stylesheetId + id;
        style.textContent = '';
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

    static isEmpty(str: any): boolean {
        if (typeof str === 'number') {
            return false;
        }
        return (!str?.length);
    }

    static createEvent(eventName: string, detail: any = null): CustomEvent {
        return new CustomEvent(eventName, { detail });
    }
}

// Making the version property non-writable in TypeScript
Object.defineProperty(Utils, 'version', { writable: false, configurable: true });

export default Utils;
