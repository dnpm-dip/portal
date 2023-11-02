import type { Client, RequestBaseOptions } from 'hapic';

export type BaseAPIContext = {
    client?: Client | RequestBaseOptions
};

export type CollectionResponse<T> = {
    entries: T[]
};

export type CodeRecord<V extends string = string> = {
    code: V
};
