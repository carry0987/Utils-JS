import { encodeFormData } from './formUtils';
import { setUrlParam } from '../component/common'; 
import { FetchOptions, SendFormDataOptions } from '../interface/interfaces';

// Fetch API
export async function doFetch<T>(options: FetchOptions): Promise<T> {
    const {
        url,
        method = 'GET',
        headers = {},
        cache = 'no-cache',
        mode = 'cors',
        credentials = 'same-origin',
        body = null,
        beforeSend = null,
        success = null,
        error = null
    } = options;

    let requestURL: string | Request | URL = url;
    let initHeaders = headers instanceof Headers ? headers : new Headers(headers);
    let init: RequestInit = {
        method: method,
        mode: mode,
        headers: initHeaders,
        cache: cache,
        credentials: credentials
    };

    if (body !== null && method.toUpperCase() === 'GET') {
        requestURL = setUrlParam(typeof url === 'string' ? url : url.toString(), body as Record<string, string | number>, true);
    } else if (body !== null && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
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
    if (typeof requestURL === 'string' || requestURL instanceof URL) {
        request = new Request(requestURL, init);
    } else if (requestURL instanceof Request) {
        request = requestURL;
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
    const { url, data, method = 'POST', headers, cache, mode, credentials, success, error, beforeSend, encode = true } = options;

    const fetchOptions: FetchOptions = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        credentials: credentials,
        body: (encode && method.toUpperCase() !== 'GET') ? encodeFormData(data) : data,
        beforeSend: beforeSend,
        success: (responseData: T) => {
            success?.(responseData);
        },
        error: (caughtError) => {
            error?.(caughtError);
        }
    };

    return doFetch<T>(fetchOptions);
}

// Send form data
export async function sendFormData<T>(options: SendFormDataOptions): Promise<boolean> {
    const { url, data, method = 'POST', headers, cache, mode, credentials, success, error, beforeSend } = options;

    const fetchOptions: FetchOptions = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        credentials: credentials,
        body: encodeFormData(data),
        beforeSend: beforeSend,
        success: (responseData: T) => {
            success?.(responseData);
        },
        error: (caughtError) => {
            error?.(caughtError);
        }
    };

    return doFetch<T>(fetchOptions)
        .then(() => true)
        .catch(() => false);
}

// Alias for sendData
export const fetchData = sendData;

// Alias for sendFormData
export const sendForm = sendFormData;
