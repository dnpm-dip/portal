import type { Client, RequestBaseOptions } from 'hapic';

export type BaseAPIContext = {
    client?: Client | RequestBaseOptions
};

export type ResourceCollectionResponse<T> = {
    entries: T[],
    size?: number,
    limit?: number,
    offset?: number,
};

export type ResourceRecordResponse<T> = T;

export type CodeRecord<V extends string = string> = {
    code: V,
    system?: string,
    display?: string
};

export type KeyValueRecord<KEY = any, VALUE = number> = {
    key: KEY,
    value: VALUE
};
export type KeyValueRecords<KEY = any, VALUE = number> = KeyValueRecord<KEY, VALUE>[];

export type ConceptCount<KEY = any> = KeyValueRecord<KEY, {
    count: number,
    percent: number
}>;

export type ConceptsCount<KEY = any> = ConceptCount<KEY>[];

export type Quantity<KEY = any> = KeyValueRecord<KEY, number>;
export type Quantities<KEY = any> = Quantity<KEY>[];

export type Distribution<KEY = any> = {
    total: number,
    elements: ConceptsCount<KEY> | Quantities<KEY>
};
