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
    <div class="d-flex flex-column gap-1">
        <div v-if="entity.diagnoses">
            <strong>Diagnose</strong>

            <template
                v-for="item in entity.diagnoses"
                :key="item.code"
            >
                <span class="badge bg-dark ms-1"><DCodingText
                    :composite="true"
                    :entity="item"
                /></span>
            </template>
        </div>

        <div v-if="entity.tumorMorphologies">
            <strong>Tumor-Morphologie</strong>

            <template
                v-for="item in entity.tumorMorphologies"
                :key="item.code"
            >
                <span class="badge bg-dark ms-1"><DCodingText
                    :composite="true"
                    :entity="item"
                /></span>
            </template>
        </div>

        <div v-if="entity.medication">
            <strong>Medikation</strong>

            <template v-if="entity.medication.drugs">
                <template
                    v-for="item in entity.medication.drugs"
                    :key="item.code"
                >
                    <span class="badge bg-dark ms-1">{{ item.display || item.code }}</span>
                </template>
            </template>
        </div>

        <div v-if="entity.responses">
            <strong>Response</strong>

            <template
                v-for="item in entity.responses"
                :key="item.code"
            >
                <span class="badge bg-dark ms-1">{{ item.display || item.code }}</span>
            </template>
        </div>
    </div>
    <div class="ms-3 d-flex flex-column gap-1">
        <template v-if="entity.simpleVariants">
            <template
                v-for="item in entity.simpleVariants"
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
        <template v-if="entity.copyNumberVariants">
            <template
                v-for="(item, key) in entity.copyNumberVariants"
                :key="key"
            >
                <div>
                    <strong>CNV</strong>

                    <ul class="list-unstyled">
                        <li v-if="item.type">
                            <strong>&bull; Type</strong>
                            {{ item.type.display || item.type.code }}
                        </li>
                        <li v-if="item.affectedGenes">
                            <strong>&bull; Betroffene Gene</strong>
                            <template
                                v-for="el in item.affectedGenes"
                                :key="el.code"
                            >
                                <span class="badge bg-dark ms-1">{{ el.display || el.code }}</span>
                            </template>
                        </li>
                    </ul>
                </div>
            </template>
        </template>
        <template v-if="entity.dnaFusions">
            <template
                v-for="(item, key) in entity.dnaFusions"
                :key="key"
            >
                <div>
                    <strong>DNA-Fusion</strong>

                    <ul class="list-unstyled">
                        <li v-if="item.fusionPartner3pr">
                            <strong>&bull; 3'-Gen</strong> {{ item.fusionPartner3pr }}
                        </li>
                        <li v-if="item.fusionPartner5pr">
                            <strong>&bull; 5'-Gen</strong> {{ item.fusionPartner5pr }}
                        </li>
                    </ul>
                </div>
            </template>
        </template>
        <template v-if="entity.rnaFusions">
            <template
                v-for="(item, key) in entity.rnaFusions"
                :key="key"
            >
                <div>
                    <strong>RNA-Fusion</strong>

                    <ul class="list-unstyled">
                        <li v-if="item.fusionPartner3pr">
                            <strong>&bull; 3'-Gen</strong> {{ item.fusionPartner3pr }}
                        </li>
                        <li v-if="item.fusionPartner5pr">
                            <strong>&bull; 5'-Gen</strong> {{ item.fusionPartner5pr }}
                        </li>
                    </ul>
                </div>
            </template>
        </template>
    </div>
</template>
