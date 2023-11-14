import type { Slots, VNodeChild } from 'vue';
import type { ObjectLiteral } from '../../../types';
import type { ResourceSlotName } from '../constants';

export type ResourceRecordManagerLoadFn<
    DATA extends ObjectLiteral = ObjectLiteral,
> = () => Promise<DATA>;

export type ResourceRecordManagerContext<
    T extends ObjectLiteral = ObjectLiteral,
> = {
    data?: T,
    load: ResourceRecordManagerLoadFn<T>,
    slots?: Slots,
    expose?: (exposed?: Record<string, any>) => void
};

export type ResourceRecordManagerOutput = {
    load: ResourceRecordLoadFn,
    render: () => VNodeChild
};

export type ResourceRecordLoadFn = () => Promise<any>;

export type ResourceRecordDefaultSlotProps<T> = {
    data: T,
    busy: boolean,
    load: ResourceRecordLoadFn
};

export type ResourceRecordErrorSlotProps = {
    error: Error
};

export type ResourceRecordSlots<T> = {
    [ResourceSlotName.DEFAULT]: ResourceRecordDefaultSlotProps<T>,
    [ResourceSlotName.ERROR]: ResourceRecordErrorSlotProps,
    [ResourceSlotName.LOADING]: undefined
};
