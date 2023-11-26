import type { ResourceRecordEventsType } from './types';

export function defineResourceRecordEvents<T>() : ResourceRecordEventsType<T> {
    return {
        failed: (_item: Error) => true,
        created: (_item: T) => true,
        deleted: (_item: T) => true,
        updated: (_item: T) => true,
        resolved: (_item?: T) => true,
    };
}
