import { getDocumentSafe } from '@/module/runtimeUtils';
import type { ReplaceRule, StylesObject } from '@/types/internal';
import { isEmpty } from './universalCommon';

export let stylesheetId: string = 'utils-style';
export const replaceRule: ReplaceRule = {
    from: '.utils',
    to: '.utils-'
};

export function setStylesheetId(id: string): void {
    stylesheetId = id;
}

export function setReplaceRule(from: string, to: string): void {
    replaceRule.from = from;
    replaceRule.to = to;
}

export function injectStylesheet(stylesObject: StylesObject, id: string | null = null): void {
    const currentDocument = getDocumentSafe();
    if (!currentDocument?.head) {
        return;
    }

    id = isEmpty(id) ? '' : id;
    const style = currentDocument.createElement('style');
    style.id = stylesheetId + id;
    style.textContent = '';
    currentDocument.head.append(style);

    const stylesheet = style.sheet;
    if (!stylesheet) {
        return;
    }

    for (const selector in stylesObject) {
        if (Object.hasOwn(stylesObject, selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}

export function buildRules(ruleObject: Record<string, string>): string {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }

    return ruleSet;
}

export function compatInsertRule(
    stylesheet: CSSStyleSheet,
    selector: string,
    cssText: string,
    id: string | null = null
): void {
    id = isEmpty(id) ? '' : id;
    const modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(`${modifiedSelector}{${cssText}}`, 0);
}

export function removeStylesheet(id: string | null = null): void {
    const currentDocument = getDocumentSafe();
    if (!currentDocument) {
        return;
    }

    const styleId = isEmpty(id) ? '' : id;
    const styleElement = currentDocument.getElementById(stylesheetId + styleId);
    if (styleElement?.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}
