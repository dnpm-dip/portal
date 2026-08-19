<!--
  - Copyright (c) 2026.
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
    type Coding,
    DCodingCommaList,
    QueryEventBusEventName,
    type ResourceCollectionLoadMeta,
    injectQueryEventBus,
    toCodingGroup,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import type { PaginationMeta } from '@vuecs/pagination';
import { VCAlert } from '@vuecs/elements';
import { VCPlaceholder } from '@vuecs/placeholder';
import { QueryFilterURLKey } from '../../../constants';
import { injectHTTPClient } from '../../../core/http-client';
import type { QueryCoarseTherapyResponse } from '../../../domains';
import MGeneAlterationText from '../MGeneAlterationText.vue';
import MTherapyResponseDistributionBar from '../MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
        DCodingCommaList,
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

        const items = ref<QueryCoarseTherapyResponse[]>([]);
        const busy = ref(false);
        const total = ref(0);
        const offset = ref(0);
        const limit = ref(50);
        const sortBy = ref<TableSortState>([]);
        const error = ref<Error | null>(null);

        let revision = 0;

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
                key: 'supportingAlterations',
                label: 'Stützende Varianten',
                headerClass: 'text-left',
                cellClass: 'text-left',
            },
            {
                key: 'levelsOfEvidence',
                label: 'Evidenzgrad',
                headerClass: 'text-left',
                cellClass: 'text-left',
            },
            {
                key: 'count',
                label: 'Anzahl Therapien',
                headerClass: 'text-center',
                cellClass: 'text-center align-middle',
                sortable: true,
            },
            {
                key: 'countResponderPFSRatio',
                label: 'Responder (Von-Hoff-PFS-Ratio)',
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
                key: 'dcr',
                label: 'DCR (%)',
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
            revision += 1;
            const current = revision;

            busy.value = true;
            try {
                error.value = null;
                const sort: Record<string, 'asc' | 'desc'> = {};
                sortBy.value.forEach((s: SortDescriptor) => {
                    if (s.direction) {
                        switch (s.key) {
                            case 'tumorEntity': {
                                sort['tumorEntity.display'] = s.direction;
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

                const response = await api.query.getCoarseTherapyResponses(props.queryId, meta);
                if (revision !== current) {
                    return;
                }

                total.value = response.size ?? response.entries.length;
                limit.value = response.limit ?? limit.value;
                offset.value = response.offset ?? offset.value;
                items.value = response.entries;
            } catch (e) {
                if (revision !== current) {
                    return;
                }

                error.value = e instanceof Error ? e : new Error('Therapie-Ansprechen konnte nicht geladen werden.');
            } finally {
                if (revision === current) {
                    busy.value = false;
                }
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

        const handleMedicationClick = (coding: Coding) => {
            const group = toCodingGroup([coding]);

            if (queryFilterStore.hasItem(QueryFilterURLKey.THERAPY_IMPLEMENTED, group)) {
                queryFilterStore.setItems(QueryFilterURLKey.THERAPY_IMPLEMENTED, []);
            } else {
                queryFilterStore.setItems(QueryFilterURLKey.THERAPY_IMPLEMENTED, [group]);
            }

            queryFilterStore.setActive('used');
            queryFilterStore.commit();
        };

        const formatNumber = (value?: number, fractionDigits = 1) => {
            if (typeof value === 'undefined' || value === null) {
                return '—';
            }

            return Number(value.toFixed(fractionDigits)).toString();
        };

        return {
            items,
            busy,
            error,
            total,
            offset,
            limit,
            sortBy,
            fields,
            load,
            onSortUpdate,
            resetSort,
            handleMedicationClick,
            formatNumber,
        };
    },
});
</script>
<template>
    <VCAlert
        v-if="error"
        color="error"
        variant="soft"
        size="sm"
    >
        Daten konnten nicht geladen werden.
    </VCAlert>
    <table
        v-if="!error && busy && total === 0"
        class="w-full"
    >
        <thead>
            <tr>
                <th
                    v-for="c in fields.length"
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
                    v-for="c in fields.length"
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
    <div v-show="!error && (!busy || total > 0)">
        <VCAlert
            color="warning"
            variant="soft"
            size="sm"
            class="mb-3"
        >
            Bitte beachten: Ein Patient kann mehrere unterschiedliche Therapieumsetzungen erhalten haben.
            Die Zeilen sind ausschließlich nach Entität &amp; Medikation gruppiert, stützende Varianten sind aggregiert.
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
                <DCodingText :entity="(row as QueryCoarseTherapyResponse).tumorEntity" />
            </template>
            <template #cell-supportingAlterations="{ row }: { row: any }">
                <ul
                    v-if="(row as QueryCoarseTherapyResponse).supportingAlterations?.length"
                    class="column"
                >
                    <li
                        v-for="(item,key) in (row as QueryCoarseTherapyResponse).supportingAlterations"
                        :key="key"
                    >
                        <MGeneAlterationText :entity="item" />
                    </li>
                </ul>
                <span
                    v-else
                    class="text-fg-muted"
                >—</span>
            </template>
            <template #cell-levelsOfEvidence="{ row }: { row: any }">
                <DCodingCommaList
                    v-if="(row as QueryCoarseTherapyResponse).levelsOfEvidence?.length"
                    :items="(row as QueryCoarseTherapyResponse).levelsOfEvidence || []"
                />
                <span
                    v-else
                    class="text-fg-muted"
                >—</span>
            </template>
            <template #cell-medications="{ row }: { row: any }">
                <ul class="column">
                    <li
                        v-for="(item,key) in (row as QueryCoarseTherapyResponse).medications"
                        :key="key"
                    >
                        <a
                            href="javascript:void(0)"
                            @click.prevent="handleMedicationClick(item)"
                        >
                            <DCodingText :entity="item" />
                        </a>
                    </li>
                </ul>
            </template>
            <template #cell-orr="{ row }: { row: any }">
                {{ formatNumber((row as QueryCoarseTherapyResponse).orr, 0) }}
            </template>
            <template #cell-dcr="{ row }: { row: any }">
                {{ formatNumber((row as QueryCoarseTherapyResponse).dcr, 0) }}
            </template>
            <template #cell-meanDuration="{ row }: { row: any }">
                {{ formatNumber((row as QueryCoarseTherapyResponse).meanDuration) }}
            </template>
            <template #cell-responseDistribution="{ row }: { row: any }">
                <MTherapyResponseDistributionBar :distribution="(row as QueryCoarseTherapyResponse).responseDistribution" />
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
