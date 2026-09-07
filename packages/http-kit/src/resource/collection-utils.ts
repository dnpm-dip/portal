import type { URLQueryRecord } from '@dnpm-dip/kit';
import { serializeURLQueryRecord } from '@dnpm-dip/kit';
import { ResourceCollectionSortDirection } from './constants';
import type { ResourceCollectionEventsType, ResourceCollectionLoadMeta } from './types';

export function defineResourceCollectionEvents<T>() : ResourceCollectionEventsType<T> {
    return {
        failed: (_item: Error) => true,
        created: (_item: T) => true,
        deleted: (_item: T) => true,
        updated: (_item: T) => true,
    };
}

export function stringifyResourceCollectionMeta(meta: ResourceCollectionLoadMeta = {}) {
    let qs : string = '';
    if (typeof meta !== 'undefined') {
        const {
            filters, 
            limit, 
            offset, 
            sort,
        } = meta;

        const queryRecord : URLQueryRecord = { ...(filters || {}) };
        if (typeof limit !== 'undefined') {
            queryRecord.limit = limit;
        }

        if (typeof offset !== 'undefined') {
            queryRecord.offset = offset;
        }

        if (sort) {
            const items = [];

            for (const [key, value] of Object.entries(sort)) {
                if (value === ResourceCollectionSortDirection.DESC) {
                    items.push(`-${key}`);
                } else {
                    items.push(`${key}`);
                }
            }

            queryRecord.sort = items.join(',');
        }

        qs = serializeURLQueryRecord(queryRecord);
        if (qs.length > 0) {
            qs = `?${qs}`;
        }
    }

    return qs;
}
