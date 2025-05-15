<script lang="ts">
import { DCodingCommaList } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { NGSRNAFusion } from '../../domains';

export default defineComponent({
    components: { DCodingCommaList },
    props: {
        entity: {
            type: Object as PropType<NGSRNAFusion>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="entity-card">
        <div v-if="entity.localization">
            <strong>Lokalisierung</strong>
            <DCodingCommaList :items="entity.localization" />
        </div>

        <div class="d-flex flex-row">
            <div
                class="d-flex flex-column"
                style="flex: 1 1 0;"
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
            <div
                class="d-flex flex-column"
                style="flex: 1 1 0;"
            >
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
