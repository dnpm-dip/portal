<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    computed, defineComponent, onUnmounted, ref,
} from 'vue';
import {
    type Coding, DQueryFilterBox, QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore,
} from '@dnpm-dip/core';
import { QueryFilterURLKey } from '../../../constants';
import { injectHTTPClient } from '../../../core/http-client';

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
    },
    emits: ['commited'],
    async setup(props, { emit }) {
        const store = useQueryFilterStore();
        const eventBus = injectQueryEventBus();
        const httpClient = injectHTTPClient();

        const items = ref<string[]>([]);
        const itemsAvailable = ref<Coding[]>([]);
        const itemsAvailableInitialized = ref<boolean>(false);

        const load = async () => {
            try {
                const response = await httpClient.query.getDiagnosisFilter(props.queryId);
                if (
                    response &&
                    response.code
                ) {
                    itemsAvailable.value = response.code
                        .sort((a, b) => a.code.localeCompare(b.code));
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

        const init = () => {
            const storeItems = store.get(QueryFilterURLKey.DIAGNOSIS_CODE)
                .flat()
                .map((el) => el.code);

            if (storeItems.length === 0) {
                items.value = itemsAvailable.value.map((el) => el.code);

                return;
            }

            items.value = storeItems;

            const [item] = storeItems;
            if (item) {
                const index = itemsAvailable.value.findIndex((el) => el.code === item);
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
                    key !== QueryFilterURLKey.DIAGNOSIS_CODE ||
                    !listenForFilterUpdates.value
                ) {
                    return;
                }

                init();
            },
        );

        onUnmounted(() => removeFilterUpdatedHandler());

        const setFilter = () => {
            const data : string[] = [];

            if (itemsAvailable.value.length !== items.value.length) {
                data.push(...items.value);
            }

            listenForFilterUpdates.value = false;
            store.set(QueryFilterURLKey.DIAGNOSIS_CODE, data);
            listenForFilterUpdates.value = true;
        };

        const selectAll = () => {
            items.value = itemsAvailable.value.map((el) => el.code);

            setFilter();
        };

        const unselectAll = () => {
            items.value = [];

            setFilter();
        };

        Promise.resolve()
            .then(() => load())
            .then(() => init());

        const submit = () => {
            store.commit();

            emit('commited');
        };

        const handleChanged = () => {
            setFilter();
        };

        return {
            items,
            itemsAvailableInitialized,

            handleChanged,
            selectAll,
            unselectAll,
            submit,

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
                            @load="loadPage"
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="form-group">
                        <button
                            :disabled="!itemsAvailableInitialized"
                            type="button"
                            class="btn btn-xs btn-primary btn-block"
                            @click.prevent="submit"
                        >
                            Anwenden
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </DQueryFilterBox>
</template>
