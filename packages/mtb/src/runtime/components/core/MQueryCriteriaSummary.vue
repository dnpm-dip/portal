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
    },
});
</script>
<template>
    <div class="d-flex flex-row gap-3">
        <div
            v-if="entity.diagnoses || entity.tumorMorphologies"
            class="d-flex flex-column gap-1"
        >
            <span class="text-muted">Diagnose</span>

            <div v-if="entity.diagnoses">
                <strong>Kategorien</strong>

                <ul class="list-unstyled mb-0">
                    <template
                        v-for="item in entity.diagnoses"
                        :key="item.code"
                    >
                        <li class="badge bg-dark">
                            <DCodingText
                                :composite="true"
                                :entity="item"
                            />
                        </li>
                    </template>
                </ul>
            </div>

            <div v-if="entity.tumorMorphologies">
                <strong>Tumormorphologie</strong>

                <ul class="list-unstyled">
                    <template
                        v-for="item in entity.tumorMorphologies"
                        :key="item.code"
                    >
                        <li class="badge bg-dark">
                            <DCodingText
                                :composite="true"
                                :entity="item"
                            />
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div
            v-if="entity.medication"
            class="d-flex flex-column gap-1"
        >
            <span class="text-muted">Medikation</span>
            <div v-if="entity.medication.drugs">
                <strong>Drugs</strong>
                <ul class="list-unstyled mb-0">
                    <template
                        v-for="item in entity.medication.drugs"
                        :key="item.code"
                    >
                        <li>
                            <span class="badge bg-dark">{{ item.display || item.code }}</span>
                        </li>
                    </template>
                </ul>
            </div>

            <div v-if="entity.medication.usage">
                <strong>Verwendung</strong>
                <ul class="list-unstyled mb-0">
                    <template
                        v-for="item in entity.medication.usage"
                        :key="item.code"
                    >
                        <li>
                            <span class="badge bg-dark">{{ item.display || item.code }}</span>
                        </li>
                    </template>
                </ul>
            </div>

            <div v-if="entity.medication.operator">
                <strong class="me-1">Operator</strong>
                <span>{{ entity.medication.operator }}</span>
            </div>
        </div>
        <div
            v-if="entity.responses"
        >
            <span class="text-muted">Response</span>

            <ul class="list-unstyled mb-0">
                <template
                    v-for="item in entity.responses"
                    :key="item.code"
                >
                    <li>
                        <span class="badge bg-dark">{{ item.display || item.code }}</span>
                    </li>
                </template>
            </ul>
        </div>
        <div
            v-if="entity.variants"
            class="d-flex flex-column gap-1"
        >
            <span class="text-muted">Varianten</span>

            <div v-if="entity.variants.operator">
                <strong class="me-1">Operator</strong>
                <span>{{ entity.variants.operator }}</span>
            </div>

            <div class="d-flex flex-row gap-2">
                <template v-if="entity.variants?.simpleVariants">
                    <template
                        v-for="item in entity.variants?.simpleVariants"
                        :key="item.code"
                    >
                        <div>
                            <strong>SNV</strong>

                            <ul class="list-unstyled">
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
                        <div>
                            <strong>CNV</strong>

                            <ul class="list-unstyled">
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
                        <div>
                            <strong>DNA-Fusion</strong>

                            <ul class="list-unstyled">
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
                        <div>
                            <strong>RNA-Fusion</strong>

                            <ul class="list-unstyled">
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
    </div>
</template>
