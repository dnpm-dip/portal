import type {
    EmitsOptions,
    MaybeRef,
    Ref,
    SetupContext,
    Slots,
    VNodeChild,
} from 'vue';
import type { ResourceRecordEventsType } from '@dnpm-dip/http-kit';
import type { ObjectLiteral } from '../../../types';
import type { ErrorCollectionSlotProps, ErrorSlotProps } from '../../error';
import type { ResourceSlotName } from '../constants';

export type { ResourceRecordEventsType };

export type ResourceRecordManagerLoadFn<
    DATA extends ObjectLiteral = ObjectLiteral,
> = (id: string) => Promise<DATA | undefined>;

type EmitFn<T = EmitsOptions> = SetupContext<T>['emit'];

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

export type ResourceRecordFn = (reset?: boolean) => Promise<any>;

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
