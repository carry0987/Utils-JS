import { throwError } from './errorUtils';
import { QuerySelector, ElementAttributes } from '@/types/internal';

export function getElem<E extends Element = Element>(ele: string, mode: 'all', parent?: QuerySelector): NodeListOf<E>;
export function getElem<E extends Element = Element>(
    ele: E,
    mode?: string | QuerySelector | null,
    parent?: QuerySelector
): E;
export function getElem<E extends Element = Element>(
    ele: string,
    mode?: string | QuerySelector | null,
    parent?: QuerySelector
): E | null;
export function getElem<E extends Element = Element>(
    ele: string | E,
    mode?: string | QuerySelector | null,
    parent?: QuerySelector
): E | NodeListOf<E> | null {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string') {
        return ele;
    }
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

export function createElem<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attrs: ElementAttributes = {},
    text: string = ''
): HTMLElementTagNameMap[K] {
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

export function hasParent<E extends Element = Element>(ele: E, selector: string, maxDepth?: number): boolean;
export function hasParent<E extends Element = Element>(
    ele: E,
    selector: string,
    maxDepth: number,
    returnElement: true
): E | null;
export function hasParent<E extends Element = Element>(
    ele: E,
    selector: string,
    maxDepth: number = Infinity,
    returnElement: boolean = false
): boolean | E | null {
    let parent = ele.parentElement as E | null;
    let depth = 0;

    while (parent && depth < maxDepth) {
        if (parent.matches(selector)) {
            return returnElement ? parent : true;
        }
        parent = parent.parentElement as E | null;
        depth++;
    }

    return returnElement ? null : false;
}

export function findParent<E extends Element = Element>(ele: E, selector: string): E | null {
    return ele.closest<E>(selector);
}

export function findParents<E extends Element = Element>(ele: E, selector: string, maxDepth: number = Infinity): E[] {
    const parents: E[] = [];
    let parent = ele.parentElement as E | null;
    let depth = 0;

    while (parent && depth < maxDepth) {
        if (parent.matches(selector)) {
            parents.push(parent);
        }
        parent = parent.parentElement as E | null;
        depth++;
    }

    return parents;
}

export function hasChild<E extends Element = Element>(ele: E, selector: string): boolean {
    return ele.querySelector(selector) !== null;
}

export function findChild<E extends Element = Element>(ele: E, selector: string): E | null {
    return ele.querySelector<E>(selector);
}

export function findChilds<E extends Element = Element>(ele: E, selector: string, maxDepth: number = Infinity): E[] {
    const results: E[] = [];

    function recursiveFind(element: Element, depth: number) {
        if (depth > maxDepth) return;
        Array.from(element.children).forEach((child) => {
            if ((child as E).matches(selector)) {
                results.push(child as E);
            }
            recursiveFind(child, depth + 1);
        });
    }

    recursiveFind(ele, 0);

    return results;
}

export function templateToHtml(templateElem: HTMLTemplateElement): string;
export function templateToHtml(templateElem: DocumentFragment): string;
export function templateToHtml(templateElem: HTMLTemplateElement | DocumentFragment): string {
    let sourceElem: DocumentFragment | HTMLTemplateElement;
    // Check the type of templateElem
    if (templateElem instanceof HTMLTemplateElement) {
        // If it's a HTMLTemplateElement, proceed with cloning content
        sourceElem = templateElem.content.cloneNode(true) as DocumentFragment;
    } else {
        // If it's a DocumentFragment, proceed with cloning content
        sourceElem = templateElem;
    }

    const tempDiv = document.createElement('div');
    tempDiv.appendChild(sourceElem);

    return tempDiv.innerHTML;
}
