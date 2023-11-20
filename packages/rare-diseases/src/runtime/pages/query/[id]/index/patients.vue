<script lang="ts">
import type { PaginationMeta } from '@vue-layout/pagination';
import { VCPagination } from '@vue-layout/pagination';
import type { PatientFilterInput } from '@dnpm-dip/core';
import { Nav } from '@dnpm-dip/core';
import type { PropType, Ref } from 'vue';
import { ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import QueryPatientMatchEntity from '../../../../components/core/QueryPatientMatchEntity.vue';
import QueryPatientMatchList from '../../../../components/core/QueryPatientMatchList';
import type { RDQuerySession } from '../../../../domains';
import QueryPatientMatchFilters from '../../../../components/core/QueryPatientMatchFilters.vue';

export default defineNuxtComponent({
    components: {
        QueryPatientMatchFilters,
        QueryPatientMatchEntity,
        QueryPatientMatchList,
        Nav,
        VCPagination,
    },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
    setup() {
        const listRef = ref(null) as Ref<typeof QueryPatientMatchList | null>;
        const applyFilters = (input: PatientFilterInput) => {
            if (listRef.value) {
                listRef.value.load({ filters: input });
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

        <QueryPatientMatchList
            ref="listRef"
            :query-id="entity.id"
        >
            <template #default="props">
                <div class="row">
                    <div class="col-9">
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
                    </div>
                    <div class="col-3">
                        <QueryPatientMatchFilters
                            :busy="props.busy"
                            :available-filters="entity.filters.patientFilter"
                            @submit="applyFilters"
                        />
                    </div>
                </div>
            </template>
        </querypatientmatchlist>
    </div>
</template>
