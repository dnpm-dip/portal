<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    defineComponent, onUnmounted, ref, watch,
} from 'vue';
import type { BTableSortBy, TableFieldRaw } from 'bootstrap-vue-next';
import { BPlaceholderTable, BTable } from 'bootstrap-vue-next';
import DCodingText from '@dnpm-dip/core/components/core/coding/DCodingText';
import {
    DSortIndicator,
    QueryEventBusEventName,
    type ResourceCollectionLoadMeta,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import type { PaginationMeta } from '@vuecs/pagination';
import { injectHTTPClient } from '../../../core/http-client';
import type { QueryTherapyResponse } from '../../../domains';
import MGeneAlterationText from '../MGeneAlterationText.vue';
import MTherapyResponseDistributionBar from '../MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
        MGeneAlterationText,
        DCodingText,
        DSortIndicator,
        MTherapyResponseDistributionBar,
        BPlaceholderTable,
        BTable,
    },
    props: {
        queryId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const api = injectHTTPClient();
        const queryEventBus = injectQueryEventBus();
        const queryFilterStore = useQueryFilterStore();

        const tableRef = ref<InstanceType<typeof BTable> | null>(null);
        const busy = ref(false);
        const total = ref(0);
        const offset = ref(0);
        const limit = ref(50);
        const defaultSort: BTableSortBy[] = [{ key: 'score', order: 'desc' }];
        const sortBy = ref<BTableSortBy[]>([...defaultSort]);
        const sortLabelMap: Record<string, string> = { score: 'Relevanz' };

        const fields : TableFieldRaw[] = [
            {
                key: 'tumorEntity', label: 'Entität', thClass: 'text-left', tdClass: 'text-left', sortable: true,
            },
            {
                key: 'medications', label: 'Medikationen', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'supportingAlteration', label: 'Stützende Variante', thClass: 'text-left', tdClass: 'text-left', sortable: true,
            },
            {
                key: 'count', label: 'Anzahl Therapien', thClass: 'text-center', tdClass: 'text-center align-middle', sortable: true,
            },
            {
                key: 'orr', label: 'ORR (%)', thClass: 'text-center', tdClass: 'text-center align-middle', sortable: true,
            },
            {
                key: 'meanDuration', label: 'Dauer in Wochen (Ø)', thClass: 'text-center', tdClass: 'text-center align-middle', sortable: true,
            },
            {
                key: 'responseDistribution', label: 'Response Verteilung', thClass: 'text-center', tdClass: 'text-center align-middle',
            },
        ];

        const provider = async (ctx: { sortBy?: readonly BTableSortBy[] }): Promise<QueryTherapyResponse[]> => {
            busy.value = true;
            try {
                const sort: Record<string, string> = {};
                if (ctx.sortBy) {
                    ctx.sortBy.forEach((s) => {
                        if (s.order) {
                            switch (s.key) {
                                case 'tumorEntity': {
                                    sort['tumorEntity.display'] = s.order;
                                    break;
                                }
                                case 'supportingAlteration': {
                                    sort['supportingAlteration.gene.display'] = s.order;
                                    break;
                                }
                                default: {
                                    sort[s.key] = s.order;
                                    break;
                                }
                            }
                        }
                    });
                }

                const meta: ResourceCollectionLoadMeta = {
                    limit: limit.value,
                    offset: offset.value,
                    filters: queryFilterStore.buildURLRecord(),
                    sort: Object.keys(sort).length > 0 ? sort : undefined,
                };

                const response = await api.query.getTherapyResponses(props.queryId, meta);
                total.value = response.size ?? response.entries.length;
                limit.value = response.limit ?? limit.value;
                offset.value = response.offset ?? offset.value;
                return response.entries;
            } finally {
                busy.value = false;
            }
        };

        const load = (meta: PaginationMeta) => {
            offset.value = meta.offset;
            limit.value = meta.limit;
            tableRef.value?.refresh();
        };

        const removeSessionHandler = queryEventBus.on(
            QueryEventBusEventName.SESSION_UPDATED,
            () => {
                offset.value = 0;
                tableRef.value?.refresh();
            },
        );
        const removeFiltersHandler = queryEventBus.on(
            QueryEventBusEventName.FILTERS_COMMITED,
            () => {
                offset.value = 0;
                tableRef.value?.refresh();
            },
        );

        onUnmounted(() => {
            removeSessionHandler();
            removeFiltersHandler();
        });

        watch(sortBy, (value) => {
            const hasActive = value.some((s) => s.order);
            if (!hasActive) {
                sortBy.value = [...defaultSort];
                return;
            }

            const hasNonScore = value.some((s) => s.key !== 'score' && s.order);
            if (hasNonScore) {
                const filtered = value.filter((s) => s.key !== 'score');
                if (filtered.length !== value.length) {
                    sortBy.value = filtered;
                }
            }
        });

        const resetSort = () => {
            sortBy.value = [...defaultSort];
            tableRef.value?.refresh();
        };

        return {
            tableRef,
            busy,
            total,
            offset,
            limit,
            sortBy,
            sortLabelMap,
            fields,
            provider,
            load,
            resetSort,
        };
    },
});
</script>
<template>
    <BPlaceholderTable
        v-if="busy && total === 0"
        :rows="5"
        :columns="7"
        animation="wave"
    />
    <div v-show="!busy || total > 0">
        <VCPagination
            :busy="busy"
            :total="total"
            :limit="limit"
            :offset="offset"
            @load="load"
        />

        <DSortIndicator
            :sort-by="sortBy"
            :fields="fields"
            :label-map="sortLabelMap"
            @reset="resetSort"
        />

        <BTable
            ref="tableRef"
            v-model:sort-by="sortBy"
            :provider="provider"
            :fields="fields"
            :busy="busy"
            :variant="'light'"
            no-provider-paging
            :multisort="true"
            outlined
        >
            <template #cell(tumorEntity)="data">
                <DCodingText :entity="data.item.tumorEntity" />
            </template>
            <template #cell(supportingAlteration)="data">
                <MGeneAlterationText :entity="data.item.supportingAlteration" />
            </template>
            <template #cell(medications)="data">
                <ul class="column">
                    <li
                        v-for="(item,key) in data.item.medications"
                        :key="key"
                    >
                        <DCodingText :entity="item" />
                    </li>
                </ul>
            </template>
            <template #cell(responseDistribution)="data">
                <MTherapyResponseDistributionBar :distribution="data.item.responseDistribution" />
            </template>
        </BTable>

        <VCPagination
            :busy="busy"
            :total="total"
            :limit="limit"
            :offset="offset"
            @load="load"
        />
    </div>
</template>
<style scoped>
.column {
    word-break: break-all;
}
</style>
