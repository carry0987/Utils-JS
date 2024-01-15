import { getElem, createElem } from './module/domUtils';
import { ReplaceRule, StylesObject } from './type/types';

export let stylesheetId: string = 'utils-style';
export const replaceRule: ReplaceRule = {
    from: '.utils',
    to: '.utils-'
};

export function isObject(item: unknown): item is Record<string, unknown> {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
}

export function deepMerge<T>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift() as Partial<T>;
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key as keyof Partial<T>;
                const value = source[sourceKey];
                const targetKey = key as keyof T;
                if (isObject(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = {} as any;
                    }
                    deepMerge(target[targetKey] as any, value as any);
                } else {
                    target[targetKey] = value as any;
                }
            }
        }
    }

    return deepMerge(target, ...sources);
}

export function setStylesheetId(id: string): void {
    stylesheetId = id;
}

export function setReplaceRule(from: string, to: string): void {
    replaceRule.from = from;
    replaceRule.to = to;
}

// CSS Injection
export function injectStylesheet(stylesObject: StylesObject, id: string | null = null): void {
    id = isEmpty(id) ? '' : id;
    // Create a style element
    let style = createElem('style') as HTMLStyleElement;
    // WebKit hack
    style.id = stylesheetId + id;
    style.textContent = '';
    // Add the style element to the document head
    document.head.append(style);

    let stylesheet = style.sheet as CSSStyleSheet;

    for (let selector in stylesObject) {
        if (stylesObject.hasOwnProperty(selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}

export function buildRules(ruleObject: { [property: string]: string }): string {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }

    return ruleSet;
}

export function compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id: string | null = null): void {
    id = isEmpty(id) ? '' : id;
    let modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
}

export function removeStylesheet(id: string | null = null): void {
    id = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + stylesheetId + id) as Element;
    if (styleElement) {
        styleElement.parentNode!.removeChild(styleElement);
    }
}

export function isEmpty(str: unknown): boolean {
    if (typeof str === 'number') {
        return false;
    }

    return !str || (typeof str === 'string' && str.length === 0);
}

export function generateRandom(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
}

export function getUrlParameter(sParam: string, url: string = window.location.search): string | null {
    const isHashParam = sParam.startsWith('#');
    const urlPart = isHashParam ? url.substring(url.indexOf('#') + 1) : url.substring(url.indexOf('?'));
    const params = new URLSearchParams(urlPart);
    const paramName = isHashParam ? sParam.substring(1) : sParam;
    const paramValue = params.get(paramName);

    return paramValue === null ? null : decodeURIComponent(paramValue);
}
