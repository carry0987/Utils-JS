export type FormDataInput = Record<string, unknown> | Blob | File | FormData | null;

export type FormDataOptions = {
    data: FormDataInput;
    parentKey?: string;
};
