export interface FetchOptions {
    url: string | Request | URL;
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit | Record<string, unknown>;
    beforeSend?: () => void;
    success?: (data: any) => void;
    error?: (error: any) => void;
}

export interface FormDataOptions {
    data: Record<string, any>;
    parentKey?: string;
}

export interface SendFormDataOptions {
    url: string | Request | URL;
    data: Record<string, any>;
    method?: string;
    beforeSend?: () => void;
    success?: (result: any) => void;
    errorCallback?: (error: any) => void;
}

export interface CookieOptions {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}
