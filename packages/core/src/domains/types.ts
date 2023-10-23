import type { Client, RequestBaseOptions } from 'hapic';

export type BaseAPIContext = {
    client?: Client | RequestBaseOptions
};

export type CollectionResponse<T> = {
    entries: T[]
};
