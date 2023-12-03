import type { ResourceCollectionEventsType } from './types';

export function defineResourceCollectionEvents<T>() : ResourceCollectionEventsType<T> {
    return {
        failed: (_item: Error) => true,
        created: (_item: T) => true,
        deleted: (_item: T) => true,
        updated: (_item: T) => true,
    };
}
