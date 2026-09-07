import type { ResourceCollectionSortDirection } from './constants';

export type ResourceCollectionEventsType<T> = {
    failed: (data: Error) => true,
    created: (data: T) => true,
    deleted: (data: T) => true,
    updated: (data: T) => true
};

export type ResourceCollectionLoadMeta = {
    limit?: number,
    offset?: number,
    total?: number,
    filters?: Record<string, any>,
    sort?: Record<string, `${ResourceCollectionSortDirection}`>,
};

export type ResourceRecordEventsType<T> = {
    failed: (data: Error) => true,
    created: (data: T) => true,
    deleted: (data: T) => true,
    updated: (data: T) => true,
    resolved: (_data?: T) => true
};
