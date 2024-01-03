<script lang="ts">
import type { PaginationMeta } from '@vuecs/pagination';
import { VCPagination } from '@vuecs/pagination';
import type { URLQueryRecord } from '@dnpm-dip/core';
import type { PropType, Ref } from 'vue';
import { inject, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import QueryDiagnosisFilter from '../../../../components/core/QueryDiagnosisFilter.vue';
import QueryHPOFilter from '../../../../components/core/QueryHPOFilter.vue';
import QueryPatientMatchEntity from '../../../../components/core/QueryPatientMatchEntity.vue';
import QueryPatientMatchList from '../../../../components/core/QueryPatientMatchList';
import type { QuerySession } from '../../../../domains';
import QueryPatientFilters from '../../../../components/core/QueryPatientFilters.vue';

export default defineNuxtComponent({
    components: {
        QueryHPOFilter,
        QueryDiagnosisFilter,
        QueryPatientFilters,
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
        const queryFilters = inject('queryFilters') as Ref<URLQueryRecord>;
        const applyFilters = (input: URLQueryRecord) => {
            queryFilters.value = {
                ...queryFilters.value,
                ...input,
            };

            if (listRef.value) {
                listRef.value.load({ filters: queryFilters.value });
            }
        };

        const applyPagination = ({ limit, offset } : PaginationMeta) => {
            if (listRef.value) {
                listRef.value.load({ limit, offset });
            }
        };

        return {
            listRef,
            applyFilters,
            applyPagination,
        };
    },
});
</script>
<template>
    <div>
        <h6>Patienten</h6>

        <div class="row">
            <div class="col-9">
                <QueryPatientMatchList
                    ref="listRef"
                    :query-id="entity.id"
                >
                    <template #default="props">
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
                                                :index="props.offset + index"
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
            <div class="col-3">
                <QueryPatientFilters
                    class="mb-3"
                    :available-filters="entity.filters.patientFilter"
                    @submit="applyFilters"
                />

                <QueryDiagnosisFilter
                    class="mb-3"
                    :available-filters="entity.filters.diagnosisFilter"
                    @submit="applyFilters"
                />

                <QueryHPOFilter
                    class="mb-3"
                    :available-filters="entity.filters.hpoFilter"
                    @submit="applyFilters"
                />
            </div>
        </div>
    </div>
</template>
