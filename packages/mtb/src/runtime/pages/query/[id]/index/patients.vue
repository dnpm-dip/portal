<script lang="ts">
import type { PaginationMeta } from '@vuecs/pagination';
import { VCPagination } from '@vuecs/pagination';
import { InjectionKey, type URLQueryRecord } from '@dnpm-dip/core';
import {
    type PropType, type Ref, nextTick, watch,
} from 'vue';
import { inject, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import QueryPatientMatchEntity from '../../../../components/core/MQueryPatientMatch.vue';
import QueryPatientMatchList from '../../../../components/core/MQueryPatientMatches';
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
        const listRef = ref(null) as Ref<typeof QueryPatientMatchList | null>;
        const queryFilters = inject(InjectionKey.QUERY_FILTERS) as Ref<URLQueryRecord>;
        watch(queryFilters, () => {
            nextTick(() => {
                if (listRef.value) {
                    listRef.value.load({ filters: queryFilters.value });
                }
            });
        }, { deep: true });

        const queryUpdatedAt = inject(InjectionKey.QUERY_UPDATED_AT) as Ref<string>;
        watch(queryUpdatedAt, () => {
            if (listRef.value) {
                listRef.value.load({ filters: queryFilters.value });
            }
        });

        const applyPagination = ({ limit, offset } : PaginationMeta) => {
            if (listRef.value) {
                listRef.value.load({ limit, offset });
            }
        };

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
                <template v-else>
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
        </querypatientmatchlist>
    </div>
</template>
