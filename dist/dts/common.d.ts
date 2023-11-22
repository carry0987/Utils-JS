import { ReplaceRule, StylesObject } from './type/types';
export declare let stylesheetId: string;
export declare const replaceRule: ReplaceRule;
export declare function getVersion(): string;
export declare function isObject(item: unknown): item is Record<string, unknown>;
export declare function deepMerge<T>(target: T, ...sources: Partial<T>[]): T;
export declare function setStylesheetId(id: string): void;
export declare function setReplaceRule(from: string, to: string): void;
export declare function injectStylesheet(stylesObject: StylesObject, id?: string | null): void;
export declare function buildRules(ruleObject: {
    [property: string]: string;
}): string;
export declare function compatInsertRule(stylesheet: CSSStyleSheet, selector: string, cssText: string, id?: string | null): void;
export declare function removeStylesheet(id?: string | null): void;
export declare function isEmpty(str: unknown): boolean;
export declare function generateRandom(length?: number): string;
export declare function getUrlParameter(sParam: string, url?: string): string | null;
