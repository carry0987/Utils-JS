export function isBrowserEnv(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getWindowSafe(): Window | null {
    return typeof window === 'undefined' ? null : window;
}

export function getDocumentSafe(): Document | null {
    return typeof document === 'undefined' ? null : document;
}

export function getLocationHrefSafe(): string | null {
    return getWindowSafe()?.location?.href ?? null;
}

export function getLocalStorageSafe(): Storage | null {
    const currentWindow = getWindowSafe();
    if (!currentWindow) {
        return null;
    }

    try {
        return currentWindow.localStorage;
    } catch {
        return null;
    }
}

export function getSessionStorageSafe(): Storage | null {
    const currentWindow = getWindowSafe();
    if (!currentWindow) {
        return null;
    }

    try {
        return currentWindow.sessionStorage;
    } catch {
        return null;
    }
}

export function getCustomEventSafe(): typeof CustomEvent | null {
    return typeof CustomEvent === 'undefined' ? null : CustomEvent;
}

export function getNodeSafe(): typeof Node | null {
    return typeof Node === 'undefined' ? null : Node;
}

export function getHtmlTemplateElementSafe(): typeof HTMLTemplateElement | null {
    return typeof HTMLTemplateElement === 'undefined' ? null : HTMLTemplateElement;
}

export function createUrl(source: string): URL {
    try {
        return new URL(source);
    } catch {
        const currentHref = getLocationHrefSafe();
        if (currentHref) {
            return new URL(source, currentHref);
        }
        throw new TypeError(`Unable to resolve URL without a browser base: ${source}`);
    }
}
