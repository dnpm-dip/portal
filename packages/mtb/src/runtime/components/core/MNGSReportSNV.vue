<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { NGSReportSNV } from '../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<NGSReportSNV>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="d-flex flex-row justify-content-between">
            <div
                class="d-flex justify-content-between mb-2 flex-column"
            >
                <div>
                    <strong>Gene</strong> {{ entity.gene.display }}
                </div>
                <div>
                    <strong>Chromosome</strong> <small>{{ entity.chromosome.display }}</small>
                </div>
                <template
                    v-if="entity.proteinChange"
                >
                    <div>
                        <strong>Protein-Änderung</strong> <small>{{ entity.proteinChange.code }}</small>
                    </div>
                </template>
                <template
                    v-if="entity.dnaChange"
                >
                    <div>
                        <strong>DNA-Änderung</strong> <small>{{ entity.dnaChange.display || entity.dnaChange.code }}</small>
                    </div>
                </template>
                <div>
                    <strong>Read Depth</strong> <small>{{ entity.readDepth }}</small>
                </div>
            </div>
            <div class="ms-3 d-flex flex-column justify-content-between mb-2 mt-2">
                <div>
                    <strong>Interpretation</strong> <small>{{ entity.interpretation.display }}</small>
                </div>
                <div>
                    <strong>Ref Allel</strong> <small>{{ entity.refAllele }}</small>
                </div>
                <div>
                    <strong>Alt Allel</strong> <small>{{ entity.altAllele }}</small>
                </div>

                <div>
                    <strong>Allel Frequenz</strong> <small>{{ entity.allelicFrequency }}</small>
                </div>
            </div>
        </div>
    </div>
</template>
