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
            <strong>Gene</strong>

            <div class="d-flex flex-row flex-wrap gap-3">
                <template
                    v-for="(item, index) in entity.geneAlterations.items"
                    :key="item.gene"
                >
                    <template v-if="index > 0">
                        <div
                            class="entity-card variant-box d-flex"
                            style="align-items: center; justify-content: center;"
                        >
                            <strong>
                                {{ entity.geneAlterations.operator?.toUpperCase() }}
                            </strong>
                        </div>
                    </template>
                    <div class="entity-card variant-box">
                        <template v-if="item.alteration">
                            <span class="text-muted">{{ item.alteration.type }}</span>
                        </template>

                        <ul class="list-unstyled">
                            <li>
                                <strong>&bull; Gen</strong> <DCodingText
                                    :entity="item.gene"
                                />
                            </li>
                            <li>
                                <strong>&bull; Wildtyp?</strong>
                                <i
                                    class="fa ms-1"
                                    :class="{
                                        'fa-check text-success': item.wildtype,
                                        'fa-times text-danger': !item.wildtype
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
                            <template v-if="item.alteration">
                                <template v-if="item.alteration.type === 'SNV'">
                                    <li v-if="item.alteration.dnaChange">
                                        <strong>&bull; DNA-Änderung</strong> {{ item.alteration.dnaChange }}
                                    </li>
                                    <li v-if="item.alteration.proteinChange">
                                        <strong>&bull; Proteinänderung</strong> {{ item.alteration.proteinChange }}
                                    </li>
                                </template>
                                <template v-else-if="item.alteration.type === 'CNV'">
                                    <li v-if="item.alteration.copyNumberType">
                                        <strong>&bull; Type</strong>
                                        <template
                                            v-for="(cnt, cntKey) in item.alteration.copyNumberType"
                                            :key="cntKey"
                                        >
                                            <span>
                                                <DCodingText :entity="cnt" />
                                            </span>
                                        </template>
                                    </li>
                                </template>
                                <template v-else>
                                    <li v-if="item.alteration.partner">
                                        <strong>&bull; 5'-Gen</strong>
                                        {{ item.alteration.partner.display || item.alteration.partner.code }}
                                    </li>
                                </template>
                            </template>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
        <div
            v-if="entity.tumorEntities || entity.tumorMorphologies"
            class="d-flex flex-column gap-1"
        >
            <strong>Diagnose</strong>

            <div v-if="entity.tumorEntities">
                <span class="text-muted">Kategorien</span>

                <div class="d-flex flex-row gap-1">
                    <template
                        v-for="item in entity.tumorEntities"
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
            <div v-if="entity.medication.items">
                <span class="text-muted">Name(n)</span>
                <div class="d-flex flex-row gap-1">
                    <template
                        v-for="(item, index) in entity.medication.items"
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
