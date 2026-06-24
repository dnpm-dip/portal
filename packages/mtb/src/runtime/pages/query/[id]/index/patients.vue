<script lang="ts">
import { QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore } from '@dnpm-dip/core';
import type { PaginationMeta } from '@vuecs/pagination';
import { VCPagination } from '@vuecs/pagination';
import {
    type PropType,
    type Ref,
} from 'vue';
import { onUnmounted, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import QueryPatientMatchEntity from '../../../../components/core/query-patient/MQueryPatientMatch.vue';
import QueryPatientMatchList from '../../../../components/core/query-patient/MQueryPatientMatches';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
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
                <div class="flex flex-col gap-3">
                    <div
                        v-for="i in 5"
                        :key="i"
                        class="entity-card w-full"
                    >
                        <VCPlaceholder
                            :width="60 + i * 5 + '%'"
                            animation="wave"
                            class="mb-1"
                        />
                        <VCPlaceholder
                            :width="40 + i * 8 + '%'"
                            animation="wave"
                            size="sm"
                        />
                    </div>
                </div>
            </template>
            <template #default="props">
                <div class="mb-2 flex items-center">
                    <span class="section-label">
                        <VCIcon name="fa6-solid:user-injured" />
                        Patienten
                    </span>
                    <span class="ms-auto text-sm text-fg-muted">
                        {{ props.total }} insgesamt
                    </span>
                </div>
                <template v-if="props.data.length > 0">
                    <div class="flex flex-col gap-3">
                        <template
                            v-for="(item, index) in props.data"
                            :key="item.id"
                        >
                            <QueryPatientMatchEntity
                                :entity="item"
                                :query-id="entity.id"
                                :index="props.offset ? props.offset + index : index"
                            />
                        </template>
                    </div>
                </template>
                <template v-else-if="!props.busy">
                    <VCAlert
                        color="info"
                        variant="soft"
                        size="sm"
                    >
                        Es wurden keine Patienten gefunden, die die Suchkriterien erfüllen.
                    </VCAlert>
                </template>
                <VCPagination
                    class="mt-3"
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
