import { describe, beforeEach, test, expect, vi } from 'vitest';
import { eventUtils } from '../src/index';

describe('eventUtils', () => {
    let element: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    test('addEventListener adds an event handler', () => {
        const handler = vi.fn();
        eventUtils.addEventListener(element, 'click', handler);
        element.click();
        expect(handler).toHaveBeenCalled();
    });

    test('removeEventListener removes an event handler', () => {
        const handler = vi.fn();
        eventUtils.addEventListener(element, 'click', handler);
        eventUtils.removeEventListener(element, 'click', handler);
        element.click();
        expect(handler).not.toHaveBeenCalled();
    });

    test('createEvent creates a custom event', () => {
        const detail = { foo: 'bar' };
        const event = eventUtils.createEvent('customEvent', detail);
        expect(event).toBeInstanceOf(CustomEvent);
        expect(event.detail).toBe(detail);
        expect(event.type).toBe('customEvent');
    });

    test('dispatchEvent dispatches a custom event', () => {
        const handler = vi.fn();
        const detail = { foo: 'bar' };

        element.addEventListener('customEvent', handler);
        eventUtils.dispatchEvent('customEvent', element, detail);

        expect(handler).toHaveBeenCalledWith(expect.objectContaining({ detail }));
    });

    test('dispatchEvent dispatches a pre-created event', () => {
        const handler = vi.fn();
        const customEvent = new Event('customEvent');

        element.addEventListener('customEvent', handler);
        eventUtils.dispatchEvent(customEvent, element);

        expect(handler).toHaveBeenCalled();
    });

    test('dispatchEvent returns false and logs error on invalid event type', () => {
        const reportErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const result = eventUtils.dispatchEvent(123 as unknown as string, element);

        expect(result).toBe(false);
        expect(reportErrorSpy).toHaveBeenCalled();

        reportErrorSpy.mockRestore();
    });
});
