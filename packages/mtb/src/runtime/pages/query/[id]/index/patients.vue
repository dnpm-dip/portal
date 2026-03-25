<script lang="ts">
import { QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore } from '@dnpm-dip/core';
import type { PaginationMeta } from '@vuecs/pagination';
import { VCPagination } from '@vuecs/pagination';
import { BPlaceholder } from 'bootstrap-vue-next';
import {
    type PropType, type Ref,
} from 'vue';
import { inject, onUnmounted, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import QueryPatientMatchEntity from '../../../../components/core/query-patient/MQueryPatientMatch.vue';
import QueryPatientMatchList from '../../../../components/core/query-patient/MQueryPatientMatches';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        BPlaceholder,
        QueryPatientMatchEntity,
        QueryPatientMatchList,
        VCPagination,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup() {
        const queryEventBus = injectQueryEventBus();
        const queryFilterStore = useQueryFilterStore();

        const listRef = ref(null) as Ref<typeof QueryPatientMatchList | null>;

        const removeSessionHandler = queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => {
            if (listRef.value) {
                listRef.value.load({ filters: queryFilterStore.buildURLRecord() });
            }
        });

        const removeFiltersHandler = queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => {
            if (listRef.value) {
                listRef.value.load({ filters: queryFilterStore.buildURLRecord() });
            }
        });

        onUnmounted(() => {
            removeSessionHandler();
            removeFiltersHandler();
        });

        const applyPagination = ({ limit, offset } : PaginationMeta) => {
            if (listRef.value) {
                listRef.value.load({ limit, offset });
            }
        };

        const queryFilters = queryFilterStore.buildURLRecord();

        return {
            queryFilters,
            listRef,
            applyPagination,
        };
    },
});
</script>
<template>
    <div>
        <QueryPatientMatchList
            ref="listRef"
            :query-id="entity.id"
            :filters="queryFilters"
        >
            <template #loading>
                <div class="list">
                    <ul class="list-body list-unstyled">
                        <li
                            v-for="i in 5"
                            :key="i"
                            class="list-item flex-row"
                        >
                            <div class="entity-card w-100 mb-2">
                                <BPlaceholder
                                    :width="60 + i * 5 + '%'"
                                    animation="wave"
                                    class="mb-1"
                                />
                                <BPlaceholder
                                    :width="40 + i * 8 + '%'"
                                    animation="wave"
                                    size="sm"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </template>
            <template #default="props">
                <div class="d-flex flex-row">
                    <div class="ms-auto">
                        Es gibt insgesamt {{ props.total }} Patienten
                    </div>
                </div>
                <template v-if="props.data.length > 0">
                    <div class="list">
                        <ul class="list-body list-unstyled">
                            <template
                                v-for="(item, index) in props.data"
                                :key="item.id"
                            >
                                <li class="list-item flex-row">
                                    <QueryPatientMatchEntity
                                        :entity="item"
                                        :query-id="entity.id"
                                        :index="props.offset ? props.offset + index : index"
                                    />
                                </li>
                            </template>
                        </ul>
                    </div>
                </template>
                <template v-else-if="!props.busy">
                    <div class="alert alert-sm alert-info">
                        Es wurden keine Patienten gefunden, die die Suchkriterien erfüllen.
                    </div>
                </template>
                <VCPagination
                    :busy="props.busy"
                    :total="props.total"
                    :limit="props.limit"
                    :offset="props.offset"
                    @load="applyPagination"
                />
            </template>
        </QueryPatientMatchList>
    </div>
</template>
