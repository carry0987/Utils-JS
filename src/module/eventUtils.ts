import { throwError, reportError } from './errorUtils';
import {
    ElementEventTarget,
    EventOptions,
    RemoveEventOptions,
    EventName,
    EventHandler,
    CustomEventName,
    CustomEventHandler,
    CombinedEventName,
    CombinedEventHandler
} from '../type/types';

export function addEventListener<K extends EventName>(element: ElementEventTarget, eventName: K, handler: EventHandler<K>, options?: EventOptions): void;
export function addEventListener<K extends CustomEventName>(element: ElementEventTarget, eventName: K, handler: CustomEventHandler, options?: EventOptions): void;
export function addEventListener(element: ElementEventTarget, eventName: CombinedEventName, handler: CombinedEventHandler, options?: EventOptions): void {
    element.addEventListener(eventName, handler as EventListener, options);
}

export function removeEventListener<K extends EventName>(element: ElementEventTarget, eventName: K, handler: EventHandler<K>, options?: RemoveEventOptions): void;
export function removeEventListener<K extends CustomEventName>(element: ElementEventTarget, eventName: K, handler: CustomEventHandler, options?: RemoveEventOptions): void;
export function removeEventListener(element: ElementEventTarget, eventName: CombinedEventName, handler: CombinedEventHandler, options?: RemoveEventOptions): void {
    element.removeEventListener(eventName, handler as EventListener, options);
}

export function createEvent<T = unknown>(
    eventName: string,
    detail?: T,
    options?: EventInit
): CustomEvent<T> {
    return new CustomEvent(eventName, { detail, ...options });
}

export function dispatchEvent<T = unknown>(
    eventOrName: string | Event,
    element: Document | Element = document,
    detail?: T,
    options?: EventInit
): boolean {
    try {
        if (typeof eventOrName === 'string') {
            let event = createEvent<T>(eventOrName, detail, options);
            return element.dispatchEvent(event);
        } else if (eventOrName instanceof Event) {
            return element.dispatchEvent(eventOrName);
        } else {
            throwError('Invalid event type');
        }
    } catch (e) {
        reportError('Dispatch Event Error:', e);
        return false;
    }
}
