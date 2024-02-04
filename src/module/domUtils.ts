import { throwError } from './errorUtils';
import { QuerySelector, ElementAttributes } from '../type/types';

export function getElem<E extends Element = Element>(ele: string | E, mode: 'all', parent?: QuerySelector): NodeList;
export function getElem<E extends Element = Element>(ele: string | E, mode?: string | QuerySelector | null, parent?: QuerySelector): E | null;
export function getElem<E extends Element = Element>(ele: string | E, mode?: string | QuerySelector | null, parent?: QuerySelector): E | NodeList | null {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string') return ele as E;
    let searchContext: QuerySelector = document;

    if (mode === null && parent) {
        searchContext = parent;
    } else if (mode && mode instanceof Node && 'querySelector' in mode) {
        searchContext = mode;
    } else if (parent && parent instanceof Node && 'querySelector' in parent) {
        searchContext = parent;
    }

    // If mode is 'all', search for all elements that match, otherwise, search for the first match
    // Casting the result as E or NodeList
    return mode === 'all' ? searchContext.querySelectorAll<E>(ele) : searchContext.querySelector<E>(ele);
}

export function createElem(tagName: string, attrs: ElementAttributes = {}, text: string = ''): Element {
    let elem = document.createElement(tagName);
    for (let attr in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
            if (attr === 'textContent' || attr === 'innerText') {
                elem.textContent = attrs[attr] as string;
            } else {
                elem.setAttribute(attr, attrs[attr] as string);
            }
        }
    }
    if (text) elem.textContent = text;

    return elem;
}

export function insertAfter(referenceNode: Node, newNode: Node | string): void {
    if (typeof newNode === 'string') {
        let elem = createElem('div');
        elem.innerHTML = newNode;
        newNode = elem.firstChild as Node;
        if (!newNode) {
            throwError('The new node (string) provided did not produce a valid DOM element.');
        }
    }
    referenceNode.parentNode!.insertBefore(newNode, referenceNode.nextSibling);
}

export function insertBefore(referenceNode: Node, newNode: Node | string): void {
    if (typeof newNode === 'string') {
        let elem = createElem('div');
        elem.innerHTML = newNode;
        newNode = elem.firstChild as Node;
        if (!newNode) {
            throwError('The new node (string) provided did not produce a valid DOM element.');
        }
    }
    referenceNode.parentNode!.insertBefore(newNode, referenceNode);
}

export function addClass(ele: Element, className: string): Element {
    ele.classList.add(className);

    return ele;
}

export function removeClass(ele: Element, className: string): Element {
    ele.classList.remove(className);

    return ele;
}

export function toggleClass(ele: Element, className: string, force?: boolean | undefined): Element {
    ele.classList.toggle(className, force);

    return ele;
}

export function hasClass(ele: Element, className: string): boolean {
    return ele.classList.contains(className);
}
