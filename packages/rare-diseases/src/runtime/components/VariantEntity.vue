<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { Variant } from '../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<Variant>,
            required: true,
        },
        queryId: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
        },
    },
    setup() {
        const extended = ref(false);

        const toggleExtended = () => {
            extended.value = !extended.value;
        };

        return {
            toggleExtended,
            extended,
        };
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="d-flex flex-row">
            <div>
                <strong>Gene</strong>
                {{ entity.gene.display }}
            </div>
            <div class="ms-auto">
                <button
                    class="btn btn-dark btn-xs"
                    @click.prevent="toggleExtended"
                >
                    <i :class="{'fa fa-chevron-down': !extended, 'fa fa-chevron-up': extended}" />
                </button>
            </div>
        </div>
        <div :class="{'d-flex flex-row justify-content-between': extended, 'mt-2': !extended}">
            <div
                class="d-flex justify-content-between mb-2"
                :class="{'flex-row': !extended, 'flex-column': extended}"
            >
                <div
                    v-if="entity.cDNAChange"
                    class="d-flex flex-grow-1 align-items-center"
                    :class="{'flex-row': extended, 'flex-column': !extended}"
                >
                    <div>
                        <strong>
                            kodierende DNA-Änderung
                        </strong>
                    </div>
                    <div :class="{'ms-1': extended}">
                        <small>{{ entity.cDNAChange.code }}</small>
                    </div>
                </div>
                <div
                    v-if="entity.gDNAChange"
                    class="d-flex flex-grow-1 align-items-center"
                    :class="{'flex-row': extended, 'flex-column': !extended}"
                >
                    <div>
                        <strong>genomische DNA-Änderung</strong>
                    </div>
                    <div :class="{'ms-1': extended}">
                        <small>{{ entity.gDNAChange.code }}</small>
                    </div>
                </div>
                <div
                    v-if="entity.proteinChange"
                    class="d-flex flex-grow-1 align-items-center"
                    :class="{'flex-row': extended, 'flex-column': !extended}"
                >
                    <div>
                        <strong>Proteinänderung</strong>
                    </div>
                    <div :class="{'ms-1': extended}">
                        <small>{{ entity.proteinChange.code }}</small>
                    </div>
                </div>
                <template v-if="extended">
                    <div>
                        <strong>ACMG-Klasse</strong> {{ entity.acmgClass.display }}
                    </div>
                    <div v-if="entity.acmgCriteria">
                        <strong>ACMG-Kriterium</strong>
                        <template
                            v-for="(item, index) in entity.acmgCriteria"
                            :key="item.code"
                        >
                            {{ index > 0 ? ', ' : '' }} {{ item.display }}
                        </template>
                    </div>
                    <div>
                        <strong>Zygosity</strong> {{ entity.zygosity.display }}
                    </div>
                </template>
            </div>
            <div
                v-if="extended"
                class="ms-3 d-flex flex-column justify-content-between mb-2 mt-2"
            />
            <div
                v-if="extended"
                class="ms-3 d-flex flex-column justify-content-between mb-2 mt-2"
            >
                <div v-if="entity.segregationAnalysis">
                    <strong>Segregationsanalyse</strong> {{ entity.segregationAnalysis.display }}
                </div>
                <div v-if="entity.modeOfInheritance">
                    <strong>Vererbungsmodus</strong> {{ entity.modeOfInheritance.display }}
                </div>
                <div v-if="entity.significance">
                    <strong>Signifikanz</strong> {{ entity.significance.display }}
                </div>
                <div>
                    <strong>Beweisniveau</strong> {{ entity.levelOfEvidence }}
                </div>
                <div>
                    <strong>ISCN Beschreibung</strong> {{ entity.iscnDescription }}
                </div>
                <div v-if="entity.clinVarAccessionID">
                    <strong>ClinVar Zugangsnummer</strong>
                    <template
                        v-for="(item, index) in entity.clinVarAccessionID"
                        :key="item"
                    >
                        {{ index > 0 ? ', ' : '' }} {{ item }}
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
