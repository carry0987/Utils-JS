interface URLSource {
    url: string;
    ignore: Array<string> | string;
}
interface URLParams {
    [key: string]: string | number | boolean | null;
}
interface FetchParams<T = any> {
    url: string | Request | URL;
    method?: string;
    headers?: HeadersInit;
    cache?: RequestCache;
    mode?: RequestMode;
    credentials?: RequestCredentials;
    beforeSend?: () => void;
    success?: (data: T) => void;
    error?: (error: Error) => void;
}
interface FetchOptions<T = any> extends FetchParams<T> {
    body?: BodyInit | Record<string, unknown> | FormData | null;
}
interface SendFormDataOptions<T = any> extends FetchParams<T> {
    data?: Record<string, any> | Blob | File | FormData | null;
    encode?: boolean;
}
interface FormDataOptions {
    data: Record<string, any> | Blob | File | FormData | null;
    parentKey?: string;
}
interface CookieOptions {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}
interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}
interface DebounceOptions extends ThrottleOptions {
    maxWait?: number;
}

export type { CookieOptions, DebounceOptions, FetchOptions, FetchParams, FormDataOptions, SendFormDataOptions, ThrottleOptions, URLParams, URLSource };
