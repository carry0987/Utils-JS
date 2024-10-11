import { describe, beforeEach, test, expect } from 'vitest';
import { domUtils } from '../src/index';

describe('domUtils', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('getElem retrieves an element by id', () => {
        const div = document.createElement('div');
        div.id = 'test';
        document.body.appendChild(div);

        const element = domUtils.getElem('#test');
        expect(element).toBe(div);
    });

    test('getElem retrieves all elements by class', () => {
        const div1 = document.createElement('div');
        div1.className = 'test';
        const div2 = document.createElement('div');
        div2.className = 'test';
        document.body.appendChild(div1);
        document.body.appendChild(div2);

        const elements = domUtils.getElem('.test', 'all');
        expect(elements).toHaveLength(2);
        expect(elements[0]).toBe(div1);
        expect(elements[1]).toBe(div2);
    });

    test('createElem creates an element with attributes and text', () => {
        const elem = domUtils.createElem('div', { id: 'test', class: 'test-class' }, 'Hello World');
        expect(elem.tagName).toBe('DIV');
        expect(elem.id).toBe('test');
        expect(elem.className).toBe('test-class');
        expect(elem.textContent).toBe('Hello World');
    });

    test('insertAfter inserts a new node after the reference node', () => {
        const referenceNode = document.createElement('div');
        referenceNode.id = 'ref';
        const newNode = document.createElement('div');
        newNode.id = 'new';
        document.body.appendChild(referenceNode);

        domUtils.insertAfter(referenceNode, newNode);
        expect(referenceNode.nextSibling).toBe(newNode);
    });

    test('insertBefore inserts a new node before the reference node', () => {
        const referenceNode = document.createElement('div');
        referenceNode.id = 'ref';
        const newNode = document.createElement('div');
        newNode.id = 'new';
        document.body.appendChild(referenceNode);

        domUtils.insertBefore(referenceNode, newNode);
        expect(referenceNode.previousSibling).toBe(newNode);
    });

    test('addClass adds a class to an element', () => {
        const elem = document.createElement('div');
        domUtils.addClass(elem, 'test-class');
        expect(elem.classList.contains('test-class')).toBe(true);
    });

    test('removeClass removes a class from an element', () => {
        const elem = document.createElement('div');
        elem.classList.add('test-class');
        domUtils.removeClass(elem, 'test-class');
        expect(elem.classList.contains('test-class')).toBe(false);
    });

    test('toggleClass toggles a class on an element', () => {
        const elem = document.createElement('div');
        domUtils.toggleClass(elem, 'test-class');
        expect(elem.classList.contains('test-class')).toBe(true);
        domUtils.toggleClass(elem, 'test-class');
        expect(elem.classList.contains('test-class')).toBe(false);
    });

    test('hasClass checks if an element has a class', () => {
        const elem = document.createElement('div');
        elem.classList.add('test-class');
        expect(domUtils.hasClass(elem, 'test-class')).toBe(true);
    });

    test('hasParent checks if an element has a parent matching the selector', () => {
        const parent = document.createElement('div');
        parent.className = 'parent';
        const child = document.createElement('div');
        parent.appendChild(child);
        document.body.appendChild(parent);

        expect(domUtils.hasParent(child, '.parent')).toBe(true);
    });

    test('findParent finds the closest parent matching the selector', () => {
        const parent = document.createElement('div');
        parent.className = 'parent';
        const child = document.createElement('div');
        parent.appendChild(child);
        document.body.appendChild(parent);

        const foundParent = domUtils.findParent(child, '.parent');
        expect(foundParent).toBe(parent);
    });

    test('findParents finds all parents matching the selector', () => {
        const parent1 = document.createElement('div');
        parent1.className = 'parent';
        const parent2 = document.createElement('div');
        parent2.className = 'parent';
        parent1.appendChild(parent2);
        const child = document.createElement('div');
        parent2.appendChild(child);
        document.body.appendChild(parent1);

        const foundParents = domUtils.findParents(child, '.parent');
        expect(foundParents).toContain(parent1);
        expect(foundParents).toContain(parent2);
    });

    test('hasChild checks if an element has a child matching the selector', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        child.className = 'child';
        parent.appendChild(child);
        document.body.appendChild(parent);

        expect(domUtils.hasChild(parent, '.child')).toBe(true);
    });

    test('findChild finds a child matching the selector', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        child.className = 'child';
        parent.appendChild(child);
        document.body.appendChild(parent);

        const foundChild = domUtils.findChild(parent, '.child');
        expect(foundChild).toBe(child);
    });

    test('findChilds finds all children matching the selector', () => {
        const parent = document.createElement('div');
        const child1 = document.createElement('div');
        child1.className = 'child';
        const child2 = document.createElement('div');
        child2.className = 'child';
        parent.appendChild(child1);
        parent.appendChild(child2);
        document.body.appendChild(parent);

        const foundChildren = domUtils.findChilds(parent, '.child');
        expect(foundChildren).toContain(child1);
        expect(foundChildren).toContain(child2);
    });

    test('templateToHtml converts template content to HTML string', () => {
        const template = document.createElement('template');
        template.innerHTML = '<div class="card"><p>Card content</p></div>';
        const content = template.content.cloneNode(true) as DocumentFragment;
        const result = domUtils.templateToHtml(content);

        expect(result).toBe('<div class="card"><p>Card content</p></div>');
    });
});
