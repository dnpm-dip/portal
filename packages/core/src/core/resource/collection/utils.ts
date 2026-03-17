import type { URLQueryRecord } from '../../../utils';
import { serializeURLQueryRecord } from '../../../utils';
import { ResourceCollectionSortDirection } from '../constants';
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
            filters, limit, offset, sort,
        } = meta;

        const queryRecord : URLQueryRecord = {
            ...(filters || {}),
        };
        if (typeof limit !== 'undefined') {
            queryRecord.limit = limit;
        }

        if (typeof offset !== 'undefined') {
            queryRecord.offset = offset;
        }

        if (sort) {
            const items = [];

            const keys = Object.keys(sort);
            for (let i = 0; i < keys.length; i++) {
                if (sort[keys[i]] === ResourceCollectionSortDirection.DESC) {
                    items.push(`-${keys[i]}`);
                } else {
                    items.push(`${keys[i]}`);
                }
            }

            queryRecord.sort = items;
        }

        qs = serializeURLQueryRecord(queryRecord);
        if (qs.length > 0) {
            qs = `?${qs}`;
        }
    }

    return qs;
}
