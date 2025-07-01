<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { Variant } from '../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<Variant>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="entity-card w-100">
        <div class="mt-2 d-flex flex-column">
            <div class="d-flex justify-content-between mb-2 flex-column">
                <div>
                    <strong>Gene</strong>
                    <template
                        v-for="(item, idx) in entity.genes"
                        :key="item.code"
                    >
                        {{ idx > 0 ? ', ' : '' }} {{ item.display }}
                    </template>
                </div>

                <div
                    v-if="entity.cDNAChange"
                    class="d-flex flex-grow-1 align-items-center flex-row"
                >
                    <div>
                        <strong>
                            kodierende DNA-Änderung
                        </strong>
                    </div>
                    <div class="ms-1">
                        <small>{{ entity.cDNAChange.code }}</small>
                    </div>
                </div>
                <div
                    v-if="entity.gDNAChange"
                    class="d-flex flex-grow-1 align-items-center flex-row"
                >
                    <div>
                        <strong>genomische DNA-Änderung</strong>
                    </div>
                    <div class="ms-1">
                        <small>{{ entity.gDNAChange.code }}</small>
                    </div>
                </div>
                <div
                    v-if="entity.proteinChange"
                    class="d-flex flex-grow-1 align-items-center flex-row"
                >
                    <div>
                        <strong>Proteinänderung</strong>
                    </div>
                    <div class="ms-1">
                        <small>{{ entity.proteinChange.code }}</small>
                    </div>
                </div>
                <div v-if="entity.acmgClass">
                    <strong>ACMG-Klasse</strong> {{ entity.acmgClass.display }}
                </div>
                <div v-if="entity.acmgCriteria">
                    <strong>ACMG-Kriterium</strong>
                    <template
                        v-for="(item, idx) in entity.acmgCriteria"
                        :key="item.code"
                    >
                        {{ idx > 0 ? ', ' : '' }} {{ item.display }}
                    </template>
                </div>
                <div v-if="entity.zygosity">
                    <strong>Zygosity</strong> {{ entity.zygosity.display }}
                </div>
                <div v-if="entity.segregationAnalysis">
                    <strong>Segregationsanalyse</strong> {{ entity.segregationAnalysis.display }}
                </div>
                <div v-if="entity.modeOfInheritance">
                    <strong>Vererbungsmodus</strong> {{ entity.modeOfInheritance.display }}
                </div>
                <div v-if="entity.significance">
                    <strong>Signifikanz</strong> {{ entity.significance.display }}
                </div>
                <div v-if="entity.clinVarID">
                    <strong>ClinVar Zugangsnummer</strong>
                    <template
                        v-for="(item, idx) in entity.clinVarID"
                        :key="item"
                    >
                        {{ idx > 0 ? ', ' : '' }} {{ item }}
                    </template>
                </div>

                <div v-if="entity.publications">
                    <strong>Publikationen</strong>

                    <template
                        v-for="(item, idx) in entity.publications"
                        :key="item"
                    >
                        {{ idx > 0 ? ', ' : '' }} {{ item.extId ? item.extId.value : item.type }}
                    </template>
                </div>

                <slot :entity="entity" />
            </div>
        </div>
    </div>
</template>
