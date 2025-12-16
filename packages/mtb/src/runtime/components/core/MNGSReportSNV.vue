<script lang="ts">
import { DCodingCommaList } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { NGSReportSNV } from '../../domains';

export default defineComponent({
    components: { DCodingCommaList },
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
        <div class="d-flex flex-row">
            <div
                class="d-flex flex-column"
                style="flex: 1 1 0;"
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
                        <strong>Protein-Änderung</strong> <small>{{ entity.proteinChange }}</small>
                    </div>
                </template>
                <template
                    v-if="entity.dnaChange"
                >
                    <div>
                        <strong>DNA-Änderung</strong> <small>{{ entity.dnaChange }}</small>
                    </div>
                </template>
                <div>
                    <strong>Read Depth</strong> <small>{{ entity.readDepth }}</small>
                </div>
            </div>
            <div
                class="d-flex flex-column"
                style="flex: 1 1 0;"
            >
                <div v-if="entity.localization">
                    <strong>Lokalisierung</strong>
                    <DCodingCommaList :items="entity.localization" />
                </div>
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
