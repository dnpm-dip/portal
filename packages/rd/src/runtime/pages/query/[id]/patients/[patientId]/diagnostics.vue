<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import RCopyNumberVariant from '../../../../../components/core/RCopyNumberVariant.vue';
import RSmallVariant from '../../../../../components/core/RSmallVariant.vue';
import RStructuralVariant from '../../../../../components/core/RStructuralVariant.vue';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: {
        RStructuralVariant, 
        RCopyNumberVariant, 
        RSmallVariant,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
        record: {
            type: Object as PropType<PatientRecord>,
            required: true,
        },
    },
});
</script>
<template>
    <h5 class="section-label mb-2">
        NGS Berichte
    </h5>
    <div class="entity-card-group flex-col">
        <template
            v-for="(item, key) in record.ngsReports"
            :key="key"
        >
            <div class="entity-card">
                <div class="mb-3">
                    <div class="flex flex-wrap -mx-2">
                        <div class="flex-1 basis-0 px-2">
                            <div>
                                <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.issuedOn }}</div>
                                <div>
                                    <strong><VCIcon name="fa6-solid:keyboard" /> Type</strong>
                                    {{ item.type.display || item.type.display }}
                                </div>
                                <!--
                                <div><strong><VCIcon name="fa6-solid:microscope" /> Labor</strong> {{ item.performingLab.display }}</div>
                                -->
                            </div>
                        </div>
                        <div class="flex-1 basis-0 px-2">
                            <div>
                                <strong><VCIcon name="fa6-solid:dna" /> Sequenzierungs-Typ</strong>
                                {{ item.sequencingInfo.platform.display || item.sequencingInfo.platform.code }}
                            </div>
                            <div v-if="item.conclusion">
                                <strong><VCIcon name="fa6-solid:lightbulb" /> Schlussfolgerung</strong>
                                {{ item.conclusion.display || item.conclusion.code }}
                            </div>
                        </div>
                        <div class="flex-1 basis-0 px-2">
                            <div><strong><VCIcon name="fa6-solid:toolbox" /> Kit</strong> {{ item.sequencingInfo.kit }}</div>
                            <template v-if="item.results && item.results.autozygosity">
                                <div>
                                    <strong><VCIcon name="fa6-solid:retweet" /> Autozygosity</strong>
                                    {{ item.results.autozygosity.value }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap -mx-2">
                    <div
                        v-if="item.results && item.results.smallVariants"
                        class="flex-1 basis-0 px-2"
                    >
                        <h6 class="section-label mb-2">
                            Small Variants
                        </h6>
                        <div class="flex flex-col gap-2">
                            <template
                                v-for="variant in item.results.smallVariants"
                                :key="variant.id"
                            >
                                <RSmallVariant
                                    :query-id="entity.id"
                                    :entity="variant"
                                />
                            </template>
                        </div>
                    </div>
                    <div
                        v-if="item.results && item.results.copyNumberVariants"
                        class="flex-1 basis-0 px-2"
                    >
                        <h6 class="section-label mb-2">
                            Copy Number Variants
                        </h6>
                        <div class="flex flex-col gap-2">
                            <template
                                v-for="variant in item.results.copyNumberVariants"
                                :key="variant.id"
                            >
                                <RCopyNumberVariant
                                    :query-id="entity.id"
                                    :entity="variant"
                                />
                            </template>
                        </div>
                    </div>
                    <div
                        v-if="item.results && item.results.structuralVariants"
                        class="flex-1 basis-0 px-2"
                    >
                        <h6 class="section-label mb-2">
                            Structural Variants
                        </h6>
                        <div class="flex flex-col gap-2">
                            <template
                                v-for="variant in item.results.structuralVariants"
                                :key="variant.id"
                            >
                                <RStructuralVariant
                                    :query-id="entity.id"
                                    :entity="variant"
                                />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
