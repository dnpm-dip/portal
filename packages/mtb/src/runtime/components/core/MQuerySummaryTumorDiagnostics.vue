<script lang="ts">
import {
    type Coding,
    DKVChartTableSwitch, DQuerySummaryGrouped, DQuerySummaryNested, useQueryFilterStore,
} from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import { navigateTo } from '#imports';
import type { QuerySummaryTumorDiagnostics } from '../../domains';

export default defineComponent({
    components: {
        DQuerySummaryNested,
        DKVChartTableSwitch,
        DQuerySummaryGrouped,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryTumorDiagnostics>,
            required: true,
        },
        queryId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const queryFilterStore = useQueryFilterStore();

        const handleClick = (keys: Coding[]) => {
            const old = queryFilterStore.get('diagnosis[code]');

            let hasChanged : boolean;

            // todo: check if one group of old is equal to keys
            if (old.length === 1) {
                hasChanged = false;
                queryFilterStore.set('diagnosis[code]', []);
            } else {
                hasChanged = true;
                queryFilterStore.set('diagnosis[code]', [keys]);
            }

            queryFilterStore.commit();

            if (hasChanged) {
                navigateTo(`/mtb/query/${props.queryId}/patients`);
            }
        };

        return {
            handleClick,
        };
    },
});
</script>
<template>
    <div>
        <div>
            <h5>Gesamtverteilung</h5>

            <div class="d-flex flex-column gap-2">
                <div class="entity-card text-center mb-3">
                    <h6>Tumor-Entitäten (ICD-10-GM)</h6>
                    <DQuerySummaryNested
                        :label="'Kategorie'"
                        :entity="entity.overallDistributions.tumorEntities"
                        :key-verbose="true"
                    >
                        <template #default="{items}">
                            <DKVChartTableSwitch
                                :coding-verbose-label="true"
                                :data="items"
                                :clickable="true"
                                @clicked="handleClick"
                            />
                        </template>
                    </DQuerySummaryNested>
                </div>

                <div class="entity-card text-center mb-3">
                    <h6>Tumor-Morphologie (ICD-O-3-M)</h6>
                    <DQuerySummaryNested
                        :label="'Kategorie'"
                        :entity="entity.overallDistributions.tumorMorphologies"
                        :key-verbose="true"
                    >
                        <template #default="{items}">
                            <DKVChartTableSwitch
                                :coding-verbose-label="true"
                                :data="items"
                            />
                        </template>
                    </DQuerySummaryNested>
                </div>
            </div>
        </div>

        <hr>

        <div>
            <h5>Verteilung nach Variante</h5>
            <DQuerySummaryGrouped
                :label="'Variante'"
                :items="entity.distributionsByVariant"
            >
                <template #default="{ item }">
                    <div class="d-flex flex-column gap-2">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Tumor-Entitäten (ICD-10-GM)
                            </h6>
                            <DKVChartTableSwitch
                                :coding-verbose-label="true"
                                :data="item.value.tumorEntities.elements"
                            />
                        </div>

                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Tumor-Morphologie (IDC-O-3-M)
                            </h6>
                            <DKVChartTableSwitch
                                :coding-verbose-label="true"
                                :data="item.value.tumorMorphologies.elements"
                            />
                        </div>
                    </div>
                </template>
            </DQuerySummaryGrouped>
        </div>
    </div>
</template>
