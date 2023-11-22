import { encodeFormData } from './formUtils';
import { FetchOptions, SendFormDataOptions } from '../interface/interfaces';

// Fetch API
export async function doFetch(options: FetchOptions): Promise<any> {
    const {
        url,
        method = 'GET',
        headers = {},
        body = null,
        beforeSend = null,
        success = null,
        error = null,
    } = options;

    let initHeaders = headers instanceof Headers ? headers : new Headers(headers);
    let init: RequestInit = {
        method,
        mode: 'cors',
        headers: initHeaders
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
    let request = new Request(url, init);
    try {
        const createRequest = await new Promise<Request>((resolve) => {
            beforeSend?.();
            resolve(request);
        });
        const response = await fetch(createRequest);
        const responseData = await response.json();
        success?.(responseData);
        return responseData;
    } catch (caughtError) {
        error?.(caughtError);
        throw caughtError;
    }
}

// Send form data
export async function sendFormData(options: SendFormDataOptions): Promise<boolean> {
    const { url, data, method = 'POST', success, errorCallback } = options;

    const fetchOptions: FetchOptions = {
        url: url,
        method: method,
        body: encodeFormData(data),
        success: (responseData) => {
            if (success) {
                success(responseData);
            }
        },
        error: (caughtError) => {
            if (errorCallback) {
                errorCallback(caughtError);
            }
        }
    };

    return doFetch(fetchOptions)
        .then(() => true)
        .catch(() => false);
}
