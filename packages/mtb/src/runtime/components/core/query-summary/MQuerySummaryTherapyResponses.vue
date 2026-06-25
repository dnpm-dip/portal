<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
} from 'vue';
import { VCTableSortIndicators } from '@vuecs/table';
import type { SortDescriptor, TableColumn, TableSortState } from '@vuecs/table';
import DCodingText from '@dnpm-dip/core/components/core/coding/DCodingText';
import {
    QueryEventBusEventName,
    type ResourceCollectionLoadMeta,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import type { PaginationMeta } from '@vuecs/pagination';
import { VCAlert } from '@vuecs/elements';
import { VCPlaceholder } from '@vuecs/placeholder';
import { injectHTTPClient } from '../../../core/http-client';
import type { QueryTherapyResponse } from '../../../domains';
import MGeneAlterationText from '../MGeneAlterationText.vue';
import MTherapyResponseDistributionBar from '../MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
        MGeneAlterationText,
        DCodingText,
        VCTableSortIndicators,
        MTherapyResponseDistributionBar,
        VCAlert,
        VCPlaceholder,
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

        const items = ref<QueryTherapyResponse[]>([]);
        const busy = ref(false);
        const total = ref(0);
        const offset = ref(0);
        const limit = ref(50);
        const sortBy = ref<TableSortState>([]);

        const fields : TableColumn[] = [
            {
                key: 'tumorEntity',
                label: 'Entität',
                headerClass: 'text-left',
                cellClass: 'text-left',
                sortable: true,
            },
            {
                key: 'medications',
                label: 'Medikationen',
                headerClass: 'text-left',
                cellClass: 'text-left',
            },
            {
                key: 'supportingAlteration',
                label: 'Stützende Variante',
                headerClass: 'text-left',
                cellClass: 'text-left',
                sortable: true,
            },
            {
                key: 'count',
                label: 'Anzahl Therapien',
                headerClass: 'text-center',
                cellClass: 'text-center align-middle',
                sortable: true,
            },
            {
                key: 'orr',
                label: 'ORR (%)',
                headerClass: 'text-center',
                cellClass: 'text-center align-middle',
                sortable: true,
            },
            {
                key: 'meanDuration',
                label: 'Dauer in Wochen (Ø)',
                headerClass: 'text-center',
                cellClass: 'text-center align-middle',
                sortable: true,
            },
            {
                key: 'responseDistribution',
                label: 'Response Verteilung',
                headerClass: 'text-center',
                cellClass: 'text-center align-middle',
            },
        ];

        const refresh = async (): Promise<void> => {
            busy.value = true;
            try {
                const sort: Record<string, 'asc' | 'desc'> = {};
                sortBy.value.forEach((s: SortDescriptor) => {
                    if (s.direction) {
                        switch (s.key) {
                            case 'tumorEntity': {
                                sort['tumorEntity.display'] = s.direction;
                                break;
                            }
                            case 'supportingAlteration': {
                                sort['supportingAlteration.gene.display'] = s.direction;
                                break;
                            }
                            default: {
                                sort[s.key] = s.direction;
                                break;
                            }
                        }
                    }
                });

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
                items.value = response.entries;
            } finally {
                busy.value = false;
            }
        };

        const load = (meta: PaginationMeta) => {
            offset.value = meta.offset;
            limit.value = meta.limit;
            void refresh();
        };

        const onSortUpdate = (next: TableSortState) => {
            sortBy.value = next;
            void refresh();
        };

        onMounted(() => {
            void refresh();
        });

        const removeSessionHandler = queryEventBus.on(
            QueryEventBusEventName.SESSION_UPDATED,
            () => {
                offset.value = 0;
                void refresh();
            },
        );
        const removeFiltersHandler = queryEventBus.on(
            QueryEventBusEventName.FILTERS_COMMITED,
            () => {
                offset.value = 0;
                void refresh();
            },
        );

        onUnmounted(() => {
            removeSessionHandler();
            removeFiltersHandler();
        });

        const resetSort = () => {
            sortBy.value = [];
            void refresh();
        };

        return {
            items,
            busy,
            total,
            offset,
            limit,
            sortBy,
            fields,
            load,
            onSortUpdate,
            resetSort,
        };
    },
});
</script>
<template>
    <table
        v-if="busy && total === 0"
        class="w-full"
    >
        <thead>
            <tr>
                <th
                    v-for="c in 7"
                    :key="c"
                >
                    <VCPlaceholder
                        width="80%"
                        animation="wave"
                    />
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="r in 5"
                :key="r"
            >
                <td
                    v-for="c in 7"
                    :key="c"
                >
                    <VCPlaceholder
                        width="100%"
                        animation="wave"
                    />
                </td>
            </tr>
        </tbody>
    </table>
    <div v-show="!busy || total > 0">
        <VCAlert
            color="warning"
            variant="soft"
            size="sm"
            class="mb-3"
        >
            Bitte beachten: Ein Patient kann mehrere unterschiedliche Therapieumsetzungen erhalten haben.
        </VCAlert>

        <VCPagination
            :busy="busy"
            :total="total"
            :limit="limit"
            :offset="offset"
            @load="load"
        />

        <VCTableSortIndicators
            :sort="sortBy"
            :columns="fields"
            class="my-2"
            label="Sortierung:"
            empty-content="Noch keine Spalten sortiert"
            add-label="+ Spalte hinzufügen"
            clear-label="Alle entfernen"
            remove-aria-label="Sortierung entfernen"
            @update:sort="onSortUpdate"
        />

        <VCTable
            :data="items"
            :columns="fields"
            :busy="busy"
            :sort="sortBy"
            multi-sort
            @update:sort="onSortUpdate"
        >
            <template #cell-tumorEntity="{ row }: { row: any }">
                <DCodingText :entity="(row as QueryTherapyResponse).tumorEntity" />
            </template>
            <template #cell-supportingAlteration="{ row }: { row: any }">
                <MGeneAlterationText :entity="(row as QueryTherapyResponse).supportingAlteration" />
            </template>
            <template #cell-medications="{ row }: { row: any }">
                <ul class="column">
                    <li
                        v-for="(item,key) in (row as QueryTherapyResponse).medications"
                        :key="key"
                    >
                        <DCodingText :entity="item" />
                    </li>
                </ul>
            </template>
            <template #cell-responseDistribution="{ row }: { row: any }">
                <MTherapyResponseDistributionBar :distribution="(row as QueryTherapyResponse).responseDistribution" />
            </template>
            <VCTableEmpty />
        </VCTable>

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
