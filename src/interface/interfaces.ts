export interface URLParams {
    [key: string]: string | number | boolean | null;
}

export interface FetchParams<T = any> {
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

export interface FetchOptions<T = any> extends FetchParams<T> {
    body?: BodyInit | Record<string, unknown>;
}

export interface SendFormDataOptions<T = any> extends FetchParams<T> {
    data: Record<string, any>;
    encode?: boolean;
}

export interface FormDataOptions {
    data: Record<string, any>;
    parentKey?: string;
}

export interface CookieOptions {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}
