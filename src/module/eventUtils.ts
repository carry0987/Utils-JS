import type {
    CombinedEventHandler,
    CombinedEventName,
    CustomEventHandler,
    CustomEventName,
    ElementEventTarget,
    EventHandler,
    EventName,
    EventOptions,
    RemoveEventOptions
} from '@/types/internal';
import { reportError, throwError } from './errorUtils';
import { getCustomEventSafe, getDocumentSafe } from './runtimeUtils';

export function addEventListener<K extends EventName>(
    element: ElementEventTarget,
    eventName: K,
    handler: EventHandler<K>,
    options?: EventOptions
): void;
export function addEventListener<K extends CustomEventName>(
    element: ElementEventTarget,
    eventName: K,
    handler: CustomEventHandler,
    options?: EventOptions
): void;
export function addEventListener(
    element: ElementEventTarget,
    eventName: CombinedEventName,
    handler: CombinedEventHandler,
    options?: EventOptions
): void {
    element.addEventListener(eventName, handler as EventListener | EventListenerObject, options);
}

export function removeEventListener<K extends EventName>(
    element: ElementEventTarget,
    eventName: K,
    handler: EventHandler<K>,
    options?: RemoveEventOptions
): void;
export function removeEventListener<K extends CustomEventName>(
    element: ElementEventTarget,
    eventName: K,
    handler: CustomEventHandler,
    options?: RemoveEventOptions
): void;
export function removeEventListener(
    element: ElementEventTarget,
    eventName: CombinedEventName,
    handler: CombinedEventHandler,
    options?: RemoveEventOptions
): void {
    element.removeEventListener(eventName, handler as EventListener | EventListenerObject, options);
}

export function createEvent<T = unknown>(eventName: string, detail?: T, options?: EventInit): CustomEvent<T> {
    const CustomEventCtor = getCustomEventSafe();
    if (!CustomEventCtor) {
        throwError('CustomEvent is not available in the current runtime');
    }

    return new CustomEventCtor<T>(eventName, { detail, ...options });
}

export function dispatchEvent<T = unknown>(
    eventOrName: string | Event,
    element?: Document | Element,
    detail?: T,
    options?: EventInit
): boolean {
    try {
        const target = element ?? getDocumentSafe();
        if (!target) {
            throwError('Dispatch target is not available in the current runtime');
        }

        if (typeof eventOrName === 'string') {
            const event = createEvent<T>(eventOrName, detail, options);
            return target.dispatchEvent(event);
        } else if (typeof Event !== 'undefined' && eventOrName instanceof Event) {
            return target.dispatchEvent(eventOrName);
        } else {
            throwError('Invalid event type');
        }
    } catch (e) {
        reportError('Dispatch Event Error:', e);
        return false;
    }
}
