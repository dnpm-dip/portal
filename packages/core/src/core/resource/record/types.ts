import type {
    EmitsOptions, MaybeRef, Ref, SetupContext, Slots, VNodeChild,
} from 'vue';
import type { ObjectLiteral } from '../../../types';
import type { ErrorCollectionSlotProps, ErrorSlotProps } from '../../error';
import type { ResourceSlotName } from '../constants';

export type ResourceRecordManagerLoadFn<
    DATA extends ObjectLiteral = ObjectLiteral,
> = (id: string) => Promise<DATA | undefined>;

export type EmitFn<T = EmitsOptions> = SetupContext<T>['emit'];

export type ResourceRecordEventsType<T> = {
    failed: (data: Error) => true,
    created: (data: T) => true,
    deleted: (data: T) => true,
    updated: (data: T) => true,
    resolved: (_data?: T) => true
};

export type ResourceRecordManagerContext<
    T extends ObjectLiteral = ObjectLiteral,
> = {
    id?: MaybeRef<string | undefined>,
    data?: MaybeRef<T | undefined>,
    load: ResourceRecordManagerLoadFn<T>,
    delete?: ((id: string) => Promise<T>),
    slots?: Slots,
    expose?: (exposed?: Record<string, any>) => void,
    emit?: EmitFn<ResourceRecordEventsType<T>>
};

export type ResourceRecordManagerOutput<
T extends ObjectLiteral = ObjectLiteral,
> = {
    load: ResourceRecordFn,
    delete : ResourceRecordFn,
    render: () => VNodeChild,
    data: Ref<T | undefined>,
    busy: Ref<boolean>,
    loading: Ref<boolean>
};

export type ResourceRecordFn = () => Promise<any>;

export type ResourceRecordDefaultSlotProps<T> = {
    data: T,
    busy: boolean,
    load: ResourceRecordFn,
    delete: ResourceRecordFn
};

export type ResourceRecordSlots<T> = {
    [ResourceSlotName.DEFAULT]: ResourceRecordDefaultSlotProps<T>,
    [ResourceSlotName.ERROR]: ErrorSlotProps,
    [ResourceSlotName.ERRORS]: ErrorCollectionSlotProps,
    [ResourceSlotName.LOADING]: undefined
};
