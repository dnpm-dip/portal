<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { NGSDNAFusion, NGSReportSNV } from '../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<NGSDNAFusion>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="d-flex flex-row justify-content-around">
            <div
                class="d-flex justify-content-between mb-2 flex-column"
            >
                <h6>3'</h6>
                <div>
                    <strong>Gene</strong> {{ entity.fusionPartner3prime.gene.display }}
                </div>
                <div>
                    <strong>Chromosome</strong> <small>{{ entity.fusionPartner3prime.chromosome }}</small>
                </div>
                <div>
                    <strong>Position</strong> <small>{{ entity.fusionPartner3prime.position }}</small>
                </div>
            </div>
            <div class="ms-3 d-flex flex-column justify-content-between mb-2 mt-2">
                <h6>5'</h6>
                <div>
                    <strong>Gene</strong> {{ entity.fusionPartner5prime.gene.display }}
                </div>
                <div>
                    <strong>Chromosome</strong> <small>{{ entity.fusionPartner5prime.chromosome }}</small>
                </div>
                <div>
                    <strong>Position</strong> <small>{{ entity.fusionPartner5prime.position }}</small>
                </div>
            </div>
        </div>
    </div>
</template>
