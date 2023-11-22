export const version: string = '__version__';

// Prevent version from being modified after being set
Object.defineProperty(exports, 'version', { writable: false, configurable: true });
