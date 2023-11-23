import type { Ref, Slots, VNodeChild } from 'vue';
import type { ObjectLiteral } from '../../../types';
import type { ErrorCollectionSlotProps, ErrorSlotProps } from '../../error';
import type { ResourceSlotName } from '../constants';

export type ResourceRecordManagerLoadFn<
    DATA extends ObjectLiteral = ObjectLiteral,
> = () => Promise<DATA | undefined>;

export type ResourceRecordManagerContext<
    T extends ObjectLiteral = ObjectLiteral,
> = {
    data?: T,
    load: ResourceRecordManagerLoadFn<T>,
    slots?: Slots,
    expose?: (exposed?: Record<string, any>) => void
};

export type ResourceRecordManagerOutput<
T extends ObjectLiteral = ObjectLiteral,
> = {
    load: ResourceRecordLoadFn,
    render: () => VNodeChild,
    data: Ref<T | undefined>,
    busy: Ref<boolean>
};

export type ResourceRecordLoadFn = () => Promise<any>;

export type ResourceRecordDefaultSlotProps<T> = {
    data: T,
    busy: boolean,
    load: ResourceRecordLoadFn
};

export type ResourceRecordSlots<T> = {
    [ResourceSlotName.DEFAULT]: ResourceRecordDefaultSlotProps<T>,
    [ResourceSlotName.ERROR]: ErrorSlotProps,
    [ResourceSlotName.ERRORS]: ErrorCollectionSlotProps,
    [ResourceSlotName.LOADING]: undefined
};
