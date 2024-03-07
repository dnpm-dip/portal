<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import RCopyNumberVariant from '../../../../../components/core/RCopyNumberVariant.vue';
import RSmallVariant from '../../../../../components/core/RSmallVariant.vue';
import RStructuralVariant from '../../../../../components/core/RStructuralVariant.vue';
import VariantEntity from '../../../../../components/core/RVariant.vue';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: {
        RStructuralVariant, RCopyNumberVariant, RSmallVariant, VariantEntity,
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
    <h5>NGS Berichte</h5>
    <div class="entity-card-group flex-column">
        <template
            v-for="(item, key) in record.ngsReports"
            :key="key"
        >
            <div class="entity-card">
                <div class="mb-3">
                    <div class="row">
                        <div class="col">
                            <div>
                                <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.recordedOn }}</div>
                                <div><strong><i class="fa fa-microscope" /> Labor</strong> {{ item.performingLab.display }}</div>
                            </div>
                        </div>
                        <div class="col">
                            <div><strong><i class="fa fa-keyboard" /> Type</strong> {{ item.type.display }}</div>
                            <div>
                                <strong><i class="fa fa-dna" /> Sequenzierungs-Typ</strong>
                                {{ item.sequencingInfo.platform.display || item.sequencingInfo.platform.code }}
                            </div>
                        </div>
                        <div class="col">
                            <div><strong><i class="fas fa-toolbox" /> Kit</strong> {{ item.sequencingInfo.kit }}</div>
                            <template v-if="item.autozygosity">
                                <div><strong><i class="fa fa-retweet" /> Autozygosity</strong> {{ item.autozygosity.value }}</div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <h6>Small Variants</h6>
                        <div class="list">
                            <ul class="list-body list-unstyled">
                                <template
                                    v-for="variant in item.smallVariants"
                                    :key="variant.id"
                                >
                                    <li class="list-item flex-row">
                                        <RSmallVariant
                                            :query-id="entity.id"
                                            :entity="variant"
                                        />
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                    <div class="col">
                        <h6>Copy Number Variants</h6>
                        <div class="list">
                            <ul class="list-body list-unstyled">
                                <template
                                    v-for="variant in item.copyNumberVariants"
                                    :key="variant.id"
                                >
                                    <li class="list-item flex-row">
                                        <RCopyNumberVariant
                                            :query-id="entity.id"
                                            :entity="variant"
                                        />
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                    <div class="col">
                        <h6>Structural Variants</h6>
                        <div class="list">
                            <ul class="list-body list-unstyled">
                                <template
                                    v-for="variant in item.structuralVariants"
                                    :key="variant.id"
                                >
                                    <li class="list-item flex-row">
                                        <RStructuralVariant
                                            :query-id="entity.id"
                                            :entity="variant"
                                        />
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
