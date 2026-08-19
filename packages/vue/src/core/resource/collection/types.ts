import type {
    EmitsOptions,
    MaybeRef,
    Ref,
    SetupContext,
    Slots,
    VNodeChild,
} from 'vue';
import type { ResourceCollectionEventsType, ResourceCollectionLoadMeta } from '@dnpm-dip/http-kit';
import type { ObjectLiteral } from '@dnpm-dip/kit';
import type { ErrorCollectionSlotProps, ErrorSlotProps } from '../../error';
import type { ResourceSlotName } from '../constants';

export type { ResourceCollectionEventsType, ResourceCollectionLoadMeta };

export type ResourceCollectionLoadResponse<
    DATA extends ObjectLiteral = ObjectLiteral,
> = {
    data: DATA[],
    total?: number,
};

type EmitFn<T = EmitsOptions> = SetupContext<T>['emit'];

export type ResourceCollectionManagerContext<
    T extends ObjectLiteral = ObjectLiteral,
> = {
    load: ResourceCollectionManagerLoadFn<T>,
    slots?: Slots,
    expose?: (exposed?: Record<string, any>) => void,
    emit?: EmitFn<ResourceCollectionEventsType<T>>
    filters?: MaybeRef<ObjectLiteral | undefined>
};

export type ResourceCollectionManagerOutput<
    T extends ObjectLiteral = ObjectLiteral,
> = {
    load: ResourceCollectionManagerLoadFn<T>,
    render: () => VNodeChild,
    data: Ref<T[]>,
    busy: Ref<boolean>,
    error: Ref<Error | null>
};

export type ResourceCollectionManagerLoadFn<
    DATA extends ObjectLiteral = ObjectLiteral,
> = (data: ResourceCollectionLoadMeta) => Promise<ResourceCollectionLoadResponse<DATA>>;

export type ResourceCollectionLoadFn = (data: ResourceCollectionLoadMeta) => Promise<any>;

export type ResourceCollectionDefaultSlotProps<T> = {
    data: T[],
    busy: boolean,
    total?: number,
    limit?: number,
    offset?: number,
    load: ResourceCollectionLoadFn,
    deleted: (data: T) => void,
    created: (data: T) => void,
    updated: (data: T) => void
};

export type ResourceCollectionSlots<T> = {
    [ResourceSlotName.DEFAULT]: ResourceCollectionDefaultSlotProps<T>,
    [ResourceSlotName.ERROR]: ErrorSlotProps,
    [ResourceSlotName.ERRORS]: ErrorCollectionSlotProps,
    [ResourceSlotName.LOADING]: undefined
};
