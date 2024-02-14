import type { Ref, VNodeChild } from 'vue';
import { computed, isRef, ref } from 'vue';
import { renderError } from '../../error';
import { hasNormalizedSlot, normalizeSlot } from '../../utils';
import type { ObjectLiteral } from '../../../types';
import { ResourceSlotName } from '../constants';
import type {
    ResourceRecordDefaultSlotProps,
    ResourceRecordFn,
    ResourceRecordManagerContext,
    ResourceRecordManagerOutput,
} from './types';
import { hasOwnProperty } from '../../../utils';

export function createResourceRecordManager<
    T extends ObjectLiteral = ObjectLiteral,
>(context: ResourceRecordManagerContext<T>) : ResourceRecordManagerOutput<T> {
    const busy : Ref<boolean> = ref(false);
    const loading : Ref<boolean> = ref(false);

    const error : Ref<Error | undefined> = ref(undefined);
    let data : Ref<T | undefined>;

    if (
        context.data &&
        isRef(context.data)
    ) {
        data = context.data;
    } else {
        data = ref(undefined);
    }

    const id = computed(() => {
        if (context.id) {
            if (isRef(context.id)) {
                if (context.id.value) {
                    return context.id.value;
                }
            } else {
                return context.id;
            }
        }

        if (
            data.value &&
            hasOwnProperty(data.value, 'id') &&
            typeof data.value.id === 'string'
        ) {
            return data.value.id;
        }

        return undefined;
    });

    const load : ResourceRecordFn = async (reset?: boolean) => {
        if (loading.value || busy.value) return;

        if (!reset && data.value) {
            if (context.emit) {
                context.emit('resolved', data.value);
            }

            return;
        }

        if (!id.value) {
            return;
        }

        loading.value = true;

        try {
            data.value = await context.load(id.value);
            error.value = undefined;

            if (context.emit) {
                context.emit('resolved', data.value);
            }
        } catch (e) {
            error.value = e as Error;
            data.value = undefined;

            if (context.emit) {
                context.emit('failed', e as Error);
            }
        } finally {
            loading.value = false;
        }
    };

    const remove = async () => {
        if (
            !context.delete ||
            busy.value ||
            loading.value ||
            !id.value
        ) {
            return;
        }

        busy.value = true;

        try {
            const response = await context.delete(id.value);

            if (context.emit) {
                context.emit('deleted', response);
            }

            data.value = undefined;
            error.value = undefined;
        } catch (e) {
            error.value = e as Error;
            data.value = undefined;

            if (context.emit) {
                context.emit('failed', e as Error);
            }
        } finally {
            busy.value = false;
        }
    };

    if (typeof context.expose !== 'undefined') {
        context.expose({
            load,
        });
    }

    const render = () : VNodeChild => {
        if (typeof context.slots === 'undefined') {
            return undefined;
        }

        if (error.value) {
            return renderError({
                error: error.value,
                slots: context.slots,
                slotName: ResourceSlotName.ERROR,
                slotCollectionName: ResourceSlotName.ERRORS,
            });
        }

        if (loading.value) {
            if (hasNormalizedSlot(ResourceSlotName.LOADING, context.slots)) {
                return normalizeSlot(ResourceSlotName.LOADING, {}, context.slots);
            }

            return undefined;
        }

        if (data.value) {
            if (hasNormalizedSlot(ResourceSlotName.DEFAULT, context.slots)) {
                return normalizeSlot(
                    ResourceSlotName.DEFAULT,
                    {
                        data: data.value as T,
                        busy: busy.value,
                        load,
                        delete: remove,
                    } satisfies ResourceRecordDefaultSlotProps<T>,
                    context.slots,
                );
            }
        }

        return undefined;
    };

    return {
        delete: remove,
        data,
        busy,
        load,
        loading,
        render,
    };
}
