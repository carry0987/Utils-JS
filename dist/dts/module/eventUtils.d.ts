import { AddEventListenerParams, RemoveEventListenerParams } from '../type/types';
export declare function addEventListener(...params: AddEventListenerParams): void;
export declare function removeEventListener(...params: RemoveEventListenerParams): void;
export declare function createEvent(eventName: string, detail?: any, options?: EventInit): CustomEvent;
export declare function dispatchEvent(eventOrName: string | Event, element?: Document | Element, detail?: any, options?: EventInit): boolean;
