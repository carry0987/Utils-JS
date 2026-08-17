export type Extension = Record<string, unknown>;
export type URLSource = {
    url: string;
    ignore: Array<string> | string;
};

export type URLParams = Record<string, string | number | boolean | null>;
