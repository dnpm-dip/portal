<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { DCodingText } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QueryCriteria } from '../../domains';

export default defineComponent({
    components: { DCodingText },
    props: {
        entity: {
            type: Object as PropType<QueryCriteria>,
            required: true,
        },
        direction: {
            type: String as PropType<'vertical' | 'horizontal'>,
            default: 'vertical',
        },
    },
});
</script>
<template>
    <div
        class="d-flex gap-3"
        :class="{'flex-column': direction === 'vertical', 'flex-row': direction === 'horizontal'}"
    >
        <div
            v-if="entity.variants && (
                entity.variants.simpleVariants ||
                entity.variants.copyNumberVariants ||
                entity.variants.dnaFusions ||
                entity.variants.rnaFusions
            )"
            class="d-flex flex-column gap-1"
        >
            <strong>Varianten (<span>{{ entity.variants.operator }}</span>)</strong>

            <div class="d-flex flex-row gap-3">
                <template v-if="entity.variants?.simpleVariants">
                    <template
                        v-for="item in entity.variants?.simpleVariants"
                        :key="item.code"
                    >
                        <div class="entity-card variant-box">
                            <span class="text-muted">SNV</span>

                            <ul class="list-unstyled">
                                <li>
                                    <strong>&bull; Stützend?</strong>
                                    <i
                                        class="fa ms-1"
                                        :class="{
                                            'fa-check text-success': item.supporting,
                                            'fa-times text-danger': !item.supporting
                                        }"
                                    />
                                </li>
                                <li v-if="item.gene">
                                    <strong>&bull; Gen</strong> <DCodingText
                                        :entity="item.gene"
                                    />
                                </li>
                                <li v-if="item.dnaChange">
                                    <strong>&bull; DNA-Änderung</strong> <DCodingText
                                        :entity="item.dnaChange"
                                    />
                                </li>
                                <li v-if="item.proteinChange">
                                    <strong>&bull; Proteinänderung</strong> <DCodingText
                                        :entity="item.proteinChange"
                                    />
                                </li>
                            </ul>
                        </div>
                    </template>
                </template>
                <template v-if="entity.variants?.copyNumberVariants">
                    <template
                        v-for="(item, key) in entity.variants?.copyNumberVariants"
                        :key="key"
                    >
                        <div class="entity-card variant-box">
                            <span class="text-muted">CNV</span>

                            <ul class="list-unstyled">
                                <li>
                                    <strong>&bull; Stützend?</strong>
                                    <i
                                        class="fa ms-1"
                                        :class="{
                                            'fa-check text-success': item.supporting,
                                            'fa-times text-danger': !item.supporting
                                        }"
                                    />
                                </li>
                                <li v-if="item.type">
                                    <strong>&bull; Type</strong>
                                    {{ item.type.display || item.type.code }}
                                </li>
                                <li v-if="item.affectedGenes && item.affectedGenes.length > 0">
                                    <strong>&bull; Betroffene Gene</strong>

                                    <ul class="list-unstyled mb-0 ms-1">
                                        <template
                                            v-for="el in item.affectedGenes"
                                            :key="el.code"
                                        >
                                            <li>
                                                <span class="badge bg-dark">{{ el.display || el.code }}</span>
                                            </li>
                                        </template>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </template>
                </template>
                <template v-if="entity.variants?.dnaFusions">
                    <template
                        v-for="(item, key) in entity.variants?.dnaFusions"
                        :key="key"
                    >
                        <div class="entity-card variant-box">
                            <span class="text-muted">DNA-Fusion</span>

                            <ul class="list-unstyled">
                                <li>
                                    <strong>&bull; Stützend?</strong>
                                    <i
                                        class="fa ms-1"
                                        :class="{
                                            'fa-check text-success': item.supporting,
                                            'fa-times text-danger': !item.supporting
                                        }"
                                    />
                                </li>
                                <li v-if="item.fusionPartner3pr">
                                    <strong>&bull; 3'-Gen</strong> {{ item.fusionPartner3pr.display || item.fusionPartner3pr.code }}
                                </li>
                                <li v-if="item.fusionPartner5pr">
                                    <strong>&bull; 5'-Gen</strong> {{ item.fusionPartner5pr.display || item.fusionPartner5pr.code }}
                                </li>
                            </ul>
                        </div>
                    </template>
                </template>
                <template v-if="entity.variants?.rnaFusions">
                    <template
                        v-for="(item, key) in entity.variants?.rnaFusions"
                        :key="key"
                    >
                        <div class="entity-card variant-box">
                            <span class="text-muted">RNA-Fusion</span>

                            <ul class="list-unstyled">
                                <li>
                                    <strong>&bull; Stützend?</strong>
                                    <i
                                        class="fa ms-1"
                                        :class="{
                                            'fa-check text-success': item.supporting,
                                            'fa-times text-danger': !item.supporting
                                        }"
                                    />
                                </li>
                                <li v-if="item.fusionPartner3pr">
                                    <strong>&bull; 3'-Gen</strong> {{ item.fusionPartner3pr.display || item.fusionPartner3pr.code }}
                                </li>
                                <li v-if="item.fusionPartner5pr">
                                    <strong>&bull; 5'-Gen</strong> {{ item.fusionPartner5pr.display || item.fusionPartner5pr.code }}
                                </li>
                            </ul>
                        </div>
                    </template>
                </template>
            </div>
        </div>
        <div
            v-if="entity.diagnoses || entity.tumorMorphologies"
            class="d-flex flex-column gap-1"
        >
            <strong>Diagnose</strong>

            <div v-if="entity.diagnoses">
                <span class="text-muted">Kategorien</span>

                <div class="d-flex flex-row gap-1">
                    <template
                        v-for="item in entity.diagnoses"
                        :key="item.code"
                    >
                        <div>
                            <span class="badge bg-dark">
                                <DCodingText
                                    :composite="true"
                                    :entity="item"
                                />
                            </span>
                        </div>
                    </template>
                </div>
            </div>

            <div v-if="entity.tumorMorphologies">
                <span class="text-muted">Tumormorphologie</span>

                <div class="d-flex flex-row gap-1">
                    <template
                        v-for="item in entity.tumorMorphologies"
                        :key="item.code"
                    >
                        <div>
                            <span class="badge bg-dark">
                                <DCodingText
                                    :composite="true"
                                    :entity="item"
                                />
                            </span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div
            v-if="entity.medication"
            class="d-flex flex-column gap-1"
        >
            <strong>Medikation</strong>
            <div v-if="entity.medication.drugs">
                <span class="text-muted">Name(n)</span>
                <div class="d-flex flex-row gap-1">
                    <template
                        v-for="(item, index) in entity.medication.drugs"
                        :key="item.code"
                    >
                        <div v-if="index > 0">
                            <span>{{ entity.medication.operator }}</span>
                        </div>
                        <div>
                            <span class="badge bg-dark">{{ item.display || item.code }}</span>
                        </div>
                    </template>
                </div>
            </div>

            <div v-if="entity.medication.usage">
                <span class="text-muted">Verwendung</span>
                <div class="d-flex flex-row gap-1">
                    <template
                        v-for="item in entity.medication.usage"
                        :key="item.code"
                    >
                        <div>
                            <span class="badge bg-dark">{{ item.display || item.code }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div
            v-if="entity.responses"
        >
            <strong>Response</strong>

            <div class="d-flex flex-row gap-1">
                <template
                    v-for="item in entity.responses"
                    :key="item.code"
                >
                    <div>
                        <span class="badge bg-dark">{{ item.display || item.code }}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>
.variant-box {
    background-color: #e0e0e0 !important;
    border: 1px solid #c4c4c4;
}
</style>
