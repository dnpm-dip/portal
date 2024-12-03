<!--
  - Copyright (c) 2024-2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { DCodingText } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QueryCriteria } from '../../../domains';

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
            v-if="
                entity.geneAlterations &&
                    entity.geneAlterations.items &&
                    entity.geneAlterations.items.length > 0"
            class="d-flex flex-column gap-1"
        >
            <strong>Varianten (<span>{{ entity.geneAlterations.operator }}</span>)</strong>

            <div class="d-flex flex-row gap-3">
                <template
                    v-for="item in entity.geneAlterations.items"
                    :key="item.gene"
                >
                    <div class="entity-card variant-box">
                        <template v-if="item.variant">
                            <span class="text-muted">{{ item.variant.type }}</span>
                        </template>

                        <ul class="list-unstyled">
                            <li>
                                <strong>&bull; Gen</strong> <DCodingText
                                    :entity="item.gene"
                                />
                            </li>
                            <li>
                                <strong>&bull; Negiert?</strong>
                                <i
                                    class="fa ms-1"
                                    :class="{
                                        'fa-check text-success': item.negated,
                                        'fa-times text-danger': !item.negated
                                    }"
                                />
                            </li>
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
                            <template v-if="item.variant">
                                <template v-if="item.variant.type === 'SNV'">
                                    <li v-if="item.variant.dnaChange">
                                        <strong>&bull; DNA-Änderung</strong> <DCodingText
                                            :entity="item.variant.dnaChange"
                                        />
                                    </li>
                                    <li v-if="item.variant.proteinChange">
                                        <strong>&bull; Proteinänderung</strong> <DCodingText
                                            :entity="item.variant.proteinChange"
                                        />
                                    </li>
                                </template>
                                <template v-else-if="item.variant.type === 'CNV'">
                                    <li v-if="item.variant.copyNumberType">
                                        <strong>&bull; Type</strong>
                                        {{ item.variant.copyNumberType.display || item.variant.copyNumberType.code }}
                                    </li>
                                </template>
                                <template v-else>
                                    <li v-if="item.variant.partner">
                                        <strong>&bull; 5'-Gen</strong> {{ item.variant.partner.display || item.variant.partner.code }}
                                    </li>
                                </template>
                            </template>
                        </ul>
                    </div>
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
