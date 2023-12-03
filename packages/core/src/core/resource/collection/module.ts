import { isEqual } from 'smob';
import type { Ref, VNodeArrayChildren, VNodeChild } from 'vue';
import { isRef, ref, watch } from 'vue';
import { renderError } from '../../error';
import { hasNormalizedSlot, normalizeSlot } from '../../utils';
import type { ObjectLiteral } from '../../../types';
import { ResourceSlotName } from '../constants';
import type {
    ResourceCollectionDefaultSlotProps,
    ResourceCollectionLoadFn,
    ResourceCollectionManagerContext,
    ResourceCollectionManagerOutput,
} from './types';
import { hasOwnProperty } from '../../../utils';

export function createResourceCollectionManager<
    T extends ObjectLiteral = ObjectLiteral,
>(context: ResourceCollectionManagerContext<T>) : ResourceCollectionManagerOutput<T> {
    const total = ref(0);
    const limit = ref(20);
    const offset = ref(0);

    const busy : Ref<boolean> = ref(false);
    const data : Ref<T[]> = ref([]);
    const error : Ref<Error | null> = ref(null);
    const filters : Ref<ObjectLiteral | undefined> = ref(undefined);
    if (context.filters) {
        if (isRef(context.filters)) {
            watch(context.filters, (value: ObjectLiteral) => {
                filters.value = value;
            }, { deep: true });

            filters.value = context.filters.value as ObjectLiteral;
        } else {
            filters.value = context.filters;
        }
    }

    const load : ResourceCollectionLoadFn = async (record = {}) => {
        if (busy.value) return;

        busy.value = true;

        if (
            filters.value &&
            record.filters &&
            !isEqual(filters.value, record.filters)
        ) {
            record.limit = 20;
            record.offset = 0;
        }

        if (typeof record.filters === 'undefined') {
            record.filters = filters.value;
        } else {
            filters.value = {
                ...record.filters,
            };
        }

        if (typeof record.limit === 'number') {
            limit.value = record.limit;
        } else {
            record.limit = limit.value;
        }

        if (typeof record.offset === 'number') {
            offset.value = record.offset;
        } else {
            record.offset = offset.value;
        }

        try {
            const response = await context.load(record);

            data.value = response.data;

            if (typeof response.total === 'number') {
                total.value = response.total;
            }

            error.value = null;
        } catch (e) {
            error.value = e as Error;
            data.value = [];
        } finally {
            busy.value = false;
        }
    };

    const findIndexInCollection = (
        entity: T,
    ) : number => data.value.findIndex((el) => {
        if (hasOwnProperty(el, 'id')) {
            return el.id === entity.id;
        }
        return false;
    });

    const handleDeleted = (entity: T) => {
        if (!hasOwnProperty(entity, 'id') || typeof entity.id !== 'string') {
            return;
        }

        const index = findIndexInCollection(entity);
        if (index !== -1) {
            data.value.splice(index, 1);
            total.value--;
        }
    };

    const handleCreated = (entity: T) => {
        if (!hasOwnProperty(entity, 'id') || typeof entity.id !== 'string') {
            return;
        }

        const index = findIndexInCollection(entity);

        if (index === -1) {
            data.value.push(entity);
            total.value++;
        }
    };

    const handleUpdated = (entity: T) => {
        if (!hasOwnProperty(entity, 'id') || typeof entity.id !== 'string') {
            return;
        }

        const index = findIndexInCollection(entity);

        if (index !== -1) {
            data.value[index] = entity; // todo: maybe merge props
        }
    };

    if (typeof context.expose !== 'undefined') {
        context.expose({
            load,
            created: handleCreated,
            deleted: handleDeleted,
            updated: handleUpdated,
        });
    }

    Promise.resolve()
        .then(() => load({}));

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

        const elements : VNodeArrayChildren = [];

        if (busy.value) {
            if (hasNormalizedSlot(ResourceSlotName.LOADING, context.slots)) {
                elements.push(normalizeSlot(ResourceSlotName.LOADING, {}, context.slots));
            }
        }

        if (hasNormalizedSlot(ResourceSlotName.DEFAULT, context.slots)) {
            elements.push(normalizeSlot(
                ResourceSlotName.DEFAULT,
                {
                    data: data.value,
                    busy: busy.value,
                    total: total.value,
                    limit: limit.value,
                    offset: offset.value,
                    load,
                    deleted: handleDeleted,
                    created: handleCreated,
                    updated: handleUpdated,
                } satisfies ResourceCollectionDefaultSlotProps<T>,
                context.slots,
            ));
        }

        return elements;
    };

    return {
        error,
        data,
        busy,
        load,
        render,
    };
}
