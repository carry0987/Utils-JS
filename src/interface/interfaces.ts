export interface URLParams {
    [key: string]: string | number | boolean | null;
}

export interface FetchParams {
    url: string | Request | URL;
    method?: string;
    headers?: HeadersInit;
    cache?: RequestCache;
    mode?: RequestMode;
    credentials?: RequestCredentials;
    beforeSend?: () => void;
    success?: (data: any) => void;
    error?: (error: any) => void;
}

export interface FetchOptions extends FetchParams {
    body?: BodyInit | Record<string, unknown>;
}

export interface SendFormDataOptions extends FetchParams {
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
