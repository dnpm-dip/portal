<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, onUnmounted, ref,
} from 'vue';
import {
    type CodingGroup,
    DQueryFilterBox,
    QueryEventBusEventName,
    injectQueryEventBus,
    isCodingGroup,
    toCodingGroup,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import { QueryFilterURLKey } from '../../../constants';
import { injectHTTPClient } from '../../../core/http-client';
import type { QueryTherapyRecommendedFilter } from '../../../domains';

export default defineComponent({
    components: {
        DQueryFilterBox,
    },
    props: {
        busy: {
            type: Boolean,
            default: false,
        },
        queryId: {
            type: String,
            required: true,
        },
        type: {
            type: String as PropType<'recommended' | 'used'>,
            required: true,
        },
    },
    emits: ['commited'],
    async setup(props, { emit }) {
        const store = useQueryFilterStore();
        const eventBus = injectQueryEventBus();
        const httpClient = injectHTTPClient();

        const items = ref<string[]>([]);
        const itemsAvailable = ref<CodingGroup[]>([]);
        const itemsAvailableInitialized = ref<boolean>(false);

        const load = async () => {
            try {
                let response : QueryTherapyRecommendedFilter;
                if (props.type === 'recommended') {
                    response = await httpClient.query.getTherapyRecommendedFilter(props.queryId);
                } else {
                    response = await httpClient.query.getTherapyImplementedFilter(props.queryId);
                }

                if (
                    response &&
                    response.medication
                ) {
                    itemsAvailable.value = response.medication
                        .map((group) => toCodingGroup(group));
                }
            } catch (e) {
                itemsAvailable.value = [];
            } finally {
                itemsAvailableInitialized.value = true;
            }
        };

        const offset = ref(0);
        const limit = ref(10);
        const total = computed<number>(() => itemsAvailable.value.length);

        const availableSubset = computed(() => {
            if (itemsAvailable.value.length === 0) {
                return [];
            }

            let startIndex : number;
            if (offset.value > 0) {
                startIndex = offset.value - 1;
            } else {
                startIndex = offset.value;
            }

            const endIndex : number = startIndex + limit.value;

            return itemsAvailable.value
                .slice(startIndex, endIndex);
        });

        const loadPage = (pagination: any) => {
            limit.value = pagination.limit;
            offset.value = pagination.offset;
        };

        const storeKey = computed(() => {
            if (props.type === 'recommended') {
                return QueryFilterURLKey.THERAPY_RECOMMENDED;
            }

            return QueryFilterURLKey.THERAPY_IMPLEMENTED;
        });

        // todo: refactor
        const init = () => {
            const storeItems = store.getItems(storeKey.value)
                .filter((el) => isCodingGroup(el))
                .map((el) => el.id);

            if (storeItems.length === 0) {
                items.value = itemsAvailable.value.map((el) => el.id);

                return;
            }

            items.value = storeItems;

            const [item] = storeItems;
            if (item) {
                const index = itemsAvailable.value.findIndex((el) => el.id === item);
                if (index === -1) {
                    return;
                }

                offset.value = index === 0 ?
                    0 :
                    Math.floor((index + 1) / limit.value) * limit.value;
            }
        };

        const listenForFilterUpdates = ref(true);
        const removeFilterUpdatedHandler = eventBus.on(
            QueryEventBusEventName.FILTER_UPDATED,
            (key) => {
                if (
                    key !== storeKey.value ||
                    !listenForFilterUpdates.value
                ) {
                    return;
                }

                init();
            },
        );

        onUnmounted(() => removeFilterUpdatedHandler());

        const setFilter = () => {
            const data : CodingGroup[] = [];

            if (itemsAvailable.value.length !== items.value.length) {
                for (let i = 0; i < items.value.length; i++) {
                    const index = itemsAvailable.value.findIndex((el) => el.id === items.value[i]);
                    if (index === -1) {
                        continue;
                    }

                    data.push(itemsAvailable.value[index]);
                }
            }

            listenForFilterUpdates.value = false;
            store.setItems(storeKey.value, data);
            listenForFilterUpdates.value = true;
        };

        const selectAll = () => {
            items.value = itemsAvailable.value.map((el) => el.id);

            setFilter();
        };

        const unselectAll = () => {
            items.value = [];

            setFilter();
        };

        Promise.resolve()
            .then(() => load())
            .then(() => init());

        const handleChanged = () => {
            setFilter();
        };

        return {
            items,
            itemsAvailableInitialized,

            handleChanged,
            selectAll,
            unselectAll,

            availableSubset,
            total,
            limit,
            offset,
            loadPage,
        };
    },
});
</script>
<template>
    <DQueryFilterBox :name="type">
        <template #title>
            <template v-if="type === 'recommended'">
                <i class="fa fa-pills" /> Therapien: Empfohlen
            </template>
            <template v-else>
                <i class="fa fa-pills" /> Therapien: Umgesetzt
            </template>
        </template>
        <template #default>
            <div class=" flex-column gap-1 d-flex">
                <div class="d-flex flex-column gap-2">
                    <div class="d-flex flex-row">
                        <div>
                            <button
                                :disabled="!itemsAvailableInitialized"
                                type="button"
                                class="btn btn-xs btn-dark"
                                @click.prevent="selectAll"
                            >
                                Alle auswählen
                            </button>
                        </div>
                        <div class="ms-auto">
                            <button
                                :disabled="!itemsAvailableInitialized"
                                type="button"
                                class="btn btn-xs btn-dark"
                                @click.prevent="unselectAll"
                            >
                                Alle abwählen
                            </button>
                        </div>
                    </div>

                    <div>
                        <template
                            v-for="item in availableSubset"
                            :key="item.id"
                        >
                            <div class="form-check">
                                <VCFormInputCheckbox
                                    v-model="items"
                                    :label="true"
                                    :value="item.id"
                                    @change.prevent="handleChanged"
                                >
                                    <template #label="labelProps">
                                        <label :for="labelProps.id">
                                            <div class="d-flex flex-column">
                                                <template
                                                    v-for="sub in item.children"
                                                    :key="sub.code"
                                                >
                                                    <div>
                                                        {{ sub.display }}
                                                    </div>
                                                </template>
                                            </div>
                                        </label>
                                    </template>
                                </VCFormInputCheckbox>
                            </div>
                        </template>
                    </div>

                    <div class="ms-auto me-auto">
                        <VCPagination
                            :total="total"
                            :offset="offset"
                            :limit="limit"
                            @load="loadPage"
                        />
                    </div>
                </div>
            </div>
        </template>
    </DQueryFilterBox>
</template>
