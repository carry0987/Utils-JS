import { throwError, reportError } from './errorUtils';
import { AddEventListenerParams, RemoveEventListenerParams } from '../type/types';

export function addEventListener(...params: AddEventListenerParams): void {
    const [element, eventName, handler, options] = params;
    element.addEventListener(eventName, handler, options);
}

export function removeEventListener(...params: RemoveEventListenerParams): void {
    const [element, eventName, handler, options] = params;
    element.removeEventListener(eventName, handler, options);
}

export function createEvent(eventName: string, detail?: any, options?: EventInit): CustomEvent {
    return new CustomEvent(eventName, { detail, ...options });
}

export function dispatchEvent(eventOrName: string | Event, element: Document | Element = document, detail?: any, options?: EventInit): boolean {
    try {
        if (typeof eventOrName === 'string') {
            let event = createEvent(eventOrName, detail, options);
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
