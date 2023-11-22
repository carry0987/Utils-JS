import { QuerySelector, ElementAttributes } from '../type/types';
export declare function getElem(ele: string | QuerySelector, mode?: string | QuerySelector | null, parent?: QuerySelector): Element | NodeList | null;
export declare function createElem(tagName: string, attrs?: ElementAttributes, text?: string): Element;
export declare function insertAfter(referenceNode: Node, newNode: Node | string): void;
export declare function insertBefore(referenceNode: Node, newNode: Node | string): void;
export declare function addClass(ele: Element, className: string): Element;
export declare function removeClass(ele: Element, className: string): Element;
export declare function toggleClass(ele: Element, className: string): Element;
export declare function hasClass(ele: Element, className: string): boolean;
