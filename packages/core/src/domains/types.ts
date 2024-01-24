import type { Client, RequestBaseOptions } from 'hapic';

export type BaseAPIContext = {
    client?: Client | RequestBaseOptions
};

export type CollectionResponse<T> = {
    entries: T[],
    size?: number,
    limit?: number,
    offset?: number,
};

export type CodeRecord<V extends string = string> = {
    code: V,
    display?: string
};

export type KeyValueRecord<KEY = any, VALUE = number> = {
    key: KEY,
    value: VALUE
};
export type KeyValueRecords<KEY = any, VALUE = number> = KeyValueRecord<KEY, VALUE>[];
