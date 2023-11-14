import type { Ref, VNodeChild } from 'vue';
import { ref } from 'vue';
import { renderError } from '../../error';
import { hasNormalizedSlot, normalizeSlot } from '../../utils';
import type { ObjectLiteral } from '../../../types';
import { ResourceSlotName } from '../constants';
import type {
    ResourceRecordDefaultSlotProps,
    ResourceRecordLoadFn,
    ResourceRecordManagerContext,
    ResourceRecordManagerOutput,
} from './types';

export function createResourceRecordManager<
    T extends ObjectLiteral = ObjectLiteral,
>(context: ResourceRecordManagerContext<T>) : ResourceRecordManagerOutput {
    const busy : Ref<boolean> = ref(false);
    const data : Ref<T | undefined> = ref(undefined);
    const error : Ref<Error | undefined> = ref(undefined);

    if (context.data) {
        data.value = context.data;
    }

    const load : ResourceRecordLoadFn = async () => {
        if (busy.value) return;

        busy.value = true;

        try {
            data.value = await context.load();
            error.value = undefined;
        } catch (e) {
            error.value = e as Error;
            data.value = undefined;
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

        if (busy.value) {
            if (hasNormalizedSlot(ResourceSlotName.LOADING, context.slots)) {
                return normalizeSlot(ResourceSlotName.LOADING, {}, context.slots);
            }

            return undefined;
        }

        if (hasNormalizedSlot(ResourceSlotName.DEFAULT, context.slots)) {
            return normalizeSlot(
                ResourceSlotName.DEFAULT,
                {
                    data: data.value as T,
                    busy: busy.value,
                    load,
                } satisfies ResourceRecordDefaultSlotProps<T>,
                context.slots,
            );
        }

        return undefined;
    };

    return {
        load,
        render,
    };
}
