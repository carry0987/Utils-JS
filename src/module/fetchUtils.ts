import { encodeFormData, bodyToURLParams } from './formUtils';
import { setUrlParam } from '@/component/common';
import { FetchOptions, SendFormDataOptions } from '@/interface/interfaces';

// Fetch API
export async function doFetch<T>(options: FetchOptions<T>): Promise<Response> {
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
    const initHeaders = headers instanceof Headers ? headers : new Headers(headers);
    const init: RequestInit = {
        method: method,
        mode: mode,
        headers: initHeaders,
        cache: cache,
        credentials: credentials
    };

    if (body && body !== null && method.toUpperCase() === 'GET') {
        const params = bodyToURLParams(body);
        requestURL = setUrlParam(typeof url === 'string' ? url : url.toString(), params, true);
    } else if (body && body !== null && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
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
        if (response.ok) {
            if (typeof success === 'function') {
                // Clone the response and parse the clone
                const clonedResponse = response.clone();
                const responseData = (await clonedResponse.json()) as T;
                success?.(responseData);
            }
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (caughtError: unknown) {
        const errorObj = caughtError instanceof Error ? caughtError : new Error(String(caughtError));
        error?.(errorObj);
        throw errorObj;
    }
}

// Send data
export async function sendData<T>(options: SendFormDataOptions<T>): Promise<T> {
    const {
        url,
        data,
        method = 'POST',
        headers,
        cache,
        mode,
        credentials,
        success,
        error,
        beforeSend,
        encode = true
    } = options;

    const fetchOptions: FetchOptions<T> = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        credentials: credentials,
        body: encode && method.toUpperCase() !== 'GET' ? encodeFormData(data) : data,
        beforeSend: beforeSend,
        success: success,
        error: error
    };

    return (await doFetch<T>(fetchOptions)).json();
}

// Send form data
export async function sendFormData<T>(options: SendFormDataOptions<T>): Promise<boolean> {
    const { url, data, method = 'POST', headers, cache, mode, credentials, success, error, beforeSend } = options;

    const fetchOptions: FetchOptions<T> = {
        url: url,
        method: method,
        headers: headers,
        cache: cache,
        mode: mode,
        credentials: credentials,
        body: data ? encodeFormData(data) : null,
        beforeSend: beforeSend,
        success: success,
        error: error
    };

    return doFetch<T>(fetchOptions)
        .then(() => true)
        .catch(() => false);
}

// Alias for sendData
export const fetchData = sendData;

// Alias for sendFormData
export const sendForm = sendFormData;
