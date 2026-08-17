export type FetchParams<T = unknown> = {
    url: string | Request | URL;
    method?: string;
    headers?: HeadersInit;
    cache?: RequestCache;
    mode?: RequestMode;
    credentials?: RequestCredentials;
    beforeSend?: () => void;
    success?: (data: T) => void;
    error?: (error: Error) => void;
};

export type FetchOptions<T = unknown> = FetchParams<T> & {
    body?: BodyInit | Record<string, unknown> | FormData | null;
};

export type SendFormDataOptions<T = unknown> = FetchParams<T> & {
    data?: import('./form').FormDataInput;
    encode?: boolean;
};
