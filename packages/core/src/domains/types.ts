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

export type KeyValueRecord<
    KEY = any,
    VALUE = number,
    CHILDREN extends KeyValueRecord<any, any>[] = KeyValueRecord<any, any, any>[],
> = {
    key: KEY,
    value: VALUE,
    children?: CHILDREN
};

export type KeyValueChildrenRecord<
    KEY = any,
    VALUE = number,
    CHILDREN extends KeyValueRecord<any, any>[] = KeyValueRecord<any, any>[],
> = {
    key: KEY,
    value: VALUE,
    children?: CHILDREN
};

export type KeyValueRecords<KEY = any, VALUE = number> = KeyValueRecord<KEY, VALUE>[];

export type ConceptCountValue = {
    count: number,
    percent: number
};
export type ConceptCount<KEY = any> = KeyValueRecord<KEY, ConceptCountValue>;
export type ConceptsCount<KEY = any> = ConceptCount<KEY>[];

export type Quantity<KEY = any> = KeyValueRecord<KEY, number>;
export type Quantities<KEY = any> = Quantity<KEY>[];

export type DistributionConceptsCount<KEY = any> = {
    total: number,
    elements: ConceptsCount<KEY>
};

export type DistributionQuantities<KEY = any> = {
    total: number,
    elements: Quantities<KEY>
};

export type Distribution<KEY = any> = DistributionConceptsCount<KEY> |
DistributionQuantities<KEY>;

export type DistributionNestedElements<KEY> = KeyValueChildrenRecord<
KEY,
ConceptCountValue | number,
Quantities | ConceptsCount
>[];

export type DistributionNested<KEY = any> = {
    total: number,
    elements: DistributionNestedElements<KEY>
};
