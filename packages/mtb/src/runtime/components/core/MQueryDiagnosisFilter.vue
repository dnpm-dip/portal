<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, onUnmounted, ref,
} from 'vue';
import {
    type Coding, DQueryFilterBox, QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore,
} from '@dnpm-dip/core';

export default defineComponent({
    components: {
        DQueryFilterBox,
    },
    props: {
        available: {
            type: Object as PropType<Coding[]>,
        },
        busy: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['commited'],
    async setup(props, { emit }) {
        const store = useQueryFilterStore();
        const eventBus = injectQueryEventBus();

        const items = ref<string[]>([]);

        const offset = ref(0);
        const limit = ref(10);
        const total = computed<number>(() => (props.available ? props.available.length : 0));

        const availableSubset = computed(() => {
            if (!props.available) {
                return [];
            }

            let startIndex : number;
            if (offset.value > 0) {
                startIndex = offset.value - 1;
            } else {
                startIndex = offset.value;
            }

            const endIndex : number = startIndex + limit.value;

            return props.available
                .slice(startIndex, endIndex);
        });

        const load = (pagination: any) => {
            limit.value = pagination.limit;
            offset.value = pagination.offset;
        };

        const listenForFilterUpdates = ref(true);
        const removeFilterUpdatedHandler = eventBus.on(
            QueryEventBusEventName.FILTER_UPDATED,
            (key) => {
                if (key !== 'diagnosis[code]' || !listenForFilterUpdates.value) {
                    return;
                }

                const storeItems = store.get(key)
                    .flat()
                    .map((el) => el.code);

                if (
                    storeItems.length === 0 &&
                    !!props.available
                ) {
                    items.value = props.available.map((el) => el.code);

                    return;
                }
                items.value = storeItems;

                const [item] = storeItems;
                if (item && props.available) {
                    const index = props.available.findIndex((el) => el.code === item);
                    if (index === -1) {
                        return;
                    }

                    offset.value = index === 0 ?
                        0 :
                        Math.floor((index + 1) / limit.value) * limit.value;
                }
            },
        );

        onUnmounted(() => removeFilterUpdatedHandler());

        const setFilter = () => {
            const data : string[] = [];

            if (
                props.available &&
                props.available.length !== items.value.length
            ) {
                data.push(...items.value);
            }

            listenForFilterUpdates.value = false;
            store.set('diagnosis[code]', data);
            listenForFilterUpdates.value = true;
        };

        const reset = () => {
            if (props.available) {
                items.value = props.available.map((el) => el.code);
            }

            setFilter();
        };

        reset();

        const submit = () => {
            store.commit();

            emit('commited');
        };

        const handleChanged = () => {
            setFilter();
        };

        return {
            items,

            handleChanged,
            reset,
            submit,

            availableSubset,
            total,
            limit,
            offset,
            load,

        };
    },
});
</script>
<template>
    <DQueryFilterBox>
        <template #title>
            <h5 class="text-muted mb-0">
                Diagnose
            </h5>
        </template>
        <template #default>
            <div class=" flex-column gap-1 d-flex">
                <div class="d-flex flex-column gap-2">
                    <h6 class="mb-0">
                        <i class="fas fa-tags" /> Code
                    </h6>

                    <div>
                        <template
                            v-for="item in availableSubset"
                            :key="item.code"
                        >
                            <div class="form-check">
                                <VCFormInputCheckbox
                                    v-model="items"
                                    :label="true"
                                    :label-content="item.code +':' + item.display"
                                    :value="item.code"
                                    @change.prevent="handleChanged"
                                />
                            </div>
                        </template>
                    </div>

                    <div class="ms-auto me-auto">
                        <VCPagination
                            :total="total"
                            :offset="offset"
                            :limit="limit"
                            @load="load"
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <button
                            type="button"
                            class="btn btn-xs btn-primary btn-block"
                            @click.prevent="submit"
                        >
                            Anwenden
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            class="btn btn-xs btn-secondary btn-block"
                            @click.prevent="reset"
                        >
                            Zurücksetzen
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </DQueryFilterBox>
</template>
