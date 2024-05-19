import { encodeFormData } from './formUtils';
import { FetchOptions, SendFormDataOptions } from '../interface/interfaces';

// Fetch API
export async function doFetch<T>(options: FetchOptions): Promise<T> {
    const {
        url,
        method = 'GET',
        headers = {},
        cache = 'no-cache',
        mode = 'cors',
        body = null,
        beforeSend = null,
        success = null,
        error = null,
    } = options;

    let initHeaders = headers instanceof Headers ? headers : new Headers(headers);
    let init: RequestInit = {
        method: method,
        mode: mode,
        headers: initHeaders,
        cache: cache
    };

    if (body !== null && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
        let data = body;
        if (!(body instanceof FormData)) {
            data = JSON.stringify(body);
            if (!(init.headers instanceof Headers)) {
                init.headers = new Headers(init.headers);
            }
            init.headers.append('Content-Type', 'application/json');
        }
        init.body = data as BodyInit;
    }

    // Handle different types of URL
    let request: Request;
    if (typeof url === 'string' || url instanceof URL) {
        request = new Request(url, init);
    } else if (url instanceof Request) {
        request = url;
    } else {
        throw new Error('Invalid URL type');
    }

    try {
        const createRequest = await new Promise<Request>((resolve) => {
            beforeSend?.();
            resolve(request);
        });
        const response = await fetch(createRequest);
        const responseData = await response.json() as T;
        success?.(responseData);
        return responseData;
    } catch (caughtError) {
        error?.(caughtError);
        throw caughtError;
    }
}

// Send data
export async function sendData<T>(options: SendFormDataOptions): Promise<T> {
    const { url, data, method = 'POST', headers, cache, mode, success, errorCallback, beforeSend} = options;

    const fetchOptions: FetchOptions = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        body: encodeFormData(data),
        beforeSend: beforeSend,
        success: (responseData: T) => {
            success?.(responseData);
        },
        error: (caughtError) => {
            errorCallback?.(caughtError);
        }
    };

    return doFetch<T>(fetchOptions);
}

// Send form data
export async function sendFormData<T>(options: SendFormDataOptions): Promise<boolean> {
    const { url, data, method = 'POST', headers, cache, mode, success, errorCallback, beforeSend } = options;

    const fetchOptions: FetchOptions = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        body: encodeFormData(data),
        beforeSend: beforeSend,
        success: (responseData: T) => {
            success?.(responseData);
        },
        error: (caughtError) => {
            errorCallback?.(caughtError);
        }
    };

    return doFetch<any>(fetchOptions)
        .then(() => true)
        .catch(() => false);
}
