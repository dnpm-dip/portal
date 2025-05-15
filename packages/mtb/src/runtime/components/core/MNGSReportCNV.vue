<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { NGSReportCNV } from '../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<NGSReportCNV>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="d-flex flex-row">
            <div
                class="d-flex flex-column"
                style="flex: 1 1 0;"
            >
                <div>
                    <strong>Chromosome</strong> <small>{{ entity.chromosome.display }}</small>
                </div>
                <div>
                    <strong>Type</strong> <small>{{ entity.type.display || entity.type.code }}</small>
                </div>
                <div v-if="entity.reportedAffectedGenes">
                    <strong>Betroffene Gene</strong>
                    <template
                        v-for="(item, idx) in entity.reportedAffectedGenes"
                        :key="item"
                    >
                        {{ idx > 0 ? ', ' : '' }} {{ item.display || item.code }}
                    </template>
                </div>
                <div v-if="entity.startRange">
                    <strong>Anfangsbereich</strong> <small>{{ entity.startRange.start }} - {{ entity.startRange.end }}</small>
                </div>

                <div v-if="entity.endRange">
                    <strong>Endbereich</strong> <small>{{ entity.endRange.start }} - {{ entity.endRange.end }}</small>
                </div>
            </div>
            <div
                class="ms-3 d-flex flex-column"
                style="flex: 1 1 0;"
            >
                <div v-if="entity.totalCopyNumber">
                    <strong>Kopienzahl (insgesamt)</strong> <small>{{ entity.totalCopyNumber }}</small>
                </div>
                <div v-if="entity.relativeCopyNumber">
                    <strong>Kopienzahl (relativ)</strong> <small>{{ entity.relativeCopyNumber }}</small>
                </div>
                <div v-if="entity.copyNumberNeutralLoH">
                    <strong>Kopienzahl (LoH)</strong>
                    <template
                        v-for="(item, idx) in entity.copyNumberNeutralLoH"
                        :key="item"
                    >
                        {{ idx > 0 ? ', ' : '' }} {{ item.display || item.code }}
                    </template>
                </div>

                <div v-if="entity.cnA">
                    <strong>CNA</strong> <small>{{ entity.cnA.toFixed(2) }}</small>
                </div>

                <div v-if="entity.cnB">
                    <strong>CNB</strong> <small>{{ entity.cnB.toFixed(2) }}</small>
                </div>
            </div>
        </div>
    </div>
</template>
