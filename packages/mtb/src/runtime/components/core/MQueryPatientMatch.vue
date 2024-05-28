<script lang="ts">
import { DCodingText } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { PatientMatch } from '../../domains';

export default defineComponent({
    components: {
        DCodingText,
    },
    props: {
        entity: {
            type: Object as PropType<PatientMatch>,
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
        const extended = ref(true);

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
    <div class="entity-card w-100">
        <div class="d-flex flex-row">
            <div>
                <strong># {{ Number.isInteger(index) ? index + 1 : entity.id }}</strong>
            </div>
            <div class="ms-auto">
                <button
                    class="btn btn-dark btn-xs"
                    @click.prevent="toggleExtended"
                >
                    <i :class="{'fa fa-chevron-down': !extended, 'fa fa-chevron-up': extended}" />
                </button>

                <NuxtLink
                    :to="'/mtb/query/'+ queryId + '/patients/' +entity.id"
                    class="btn btn-xs btn-outline-primary ms-1"
                >
                    <i class="fa-solid fa-bars" />
                </NuxtLink>
            </div>
        </div>
        <div :class="{'d-flex flex-row': extended}">
            <div
                class="d-flex justify-content-between mb-2 mt-2"
                :class="{'flex-row': !extended, 'flex-column': extended}"
            >
                <div
                    v-if="entity.managingSite"
                    class="d-flex flex-grow-1 align-items-center"
                    :class="{'flex-row': extended, 'flex-column': !extended}"
                >
                    <div>
                        <strong>Standort</strong>
                    </div>
                    <div :class="{'ms-1': extended}">
                        {{ entity.managingSite.display }}
                    </div>
                </div>
                <div
                    class="d-flex flex-grow-1 align-items-center"
                    :class="{'flex-row': extended, 'flex-column': !extended}"
                >
                    <div>
                        <strong>Alter</strong>
                    </div>
                    <div :class="{'ms-1': extended}">
                        {{ entity.age.value }}
                    </div>
                </div>
                <div
                    class="d-flex flex-grow-1 align-items-center"
                    :class="{'flex-row': extended, 'flex-column': !extended}"
                >
                    <div>
                        <strong>Geschlecht</strong>
                    </div>
                    <div :class="{'ms-1': extended}">
                        {{ entity.gender.display }}
                    </div>
                </div>
                <div
                    class="d-flex flex-grow-1 align-items-center"
                    :class="{'flex-row': extended, 'flex-column': !extended}"
                >
                    <div>
                        <strong>Vital Status</strong>
                    </div>
                    <div :class="{'ms-1': extended}">
                        <template v-if="entity.vitalStatus.code === 'alive'">
                            <span class="text-success">{{ entity.vitalStatus.display }}</span>
                        </template>
                        <template v-else-if="entity.vitalStatus.code === 'deceased'">
                            <span class="text-danger">{{ entity.vitalStatus.display }}</span>
                        </template>
                        <template v-else>
                            {{ entity.vitalStatus.display }}
                        </template>
                    </div>
                </div>
            </div>
            <div
                v-if="extended"
                class="ms-3 d-flex flex-column justify-content-between mb-2 mt-2"
            >
                <div v-if="entity.matchingCriteria.diagnoses">
                    <strong>Diagnose</strong>

                    <template
                        v-for="item in entity.matchingCriteria.diagnoses"
                        :key="item.code"
                    >
                        <span class="badge bg-dark ms-1"><DCodingText
                            :composite="true"
                            :entity="item"
                        /></span>
                    </template>
                </div>

                <div v-if="entity.matchingCriteria.tumorMorphologies">
                    <strong>Tumor-Morphologie</strong>

                    <template
                        v-for="item in entity.matchingCriteria.tumorMorphologies"
                        :key="item.code"
                    >
                        <span class="badge bg-dark ms-1"><DCodingText
                            :composite="true"
                            :entity="item"
                        /></span>
                    </template>
                </div>

                <div v-if="entity.matchingCriteria.medication">
                    <strong>Medikation</strong>

                    <template v-if="entity.matchingCriteria.medication.drugs">
                        <template
                            v-for="item in entity.matchingCriteria.medication.drugs"
                            :key="item.code"
                        >
                            <span class="badge bg-dark ms-1">{{ item.display || item.code }}</span>
                        </template>
                    </template>
                </div>

                <div v-if="entity.matchingCriteria.responses">
                    <strong>Response</strong>

                    <template
                        v-for="item in entity.matchingCriteria.responses"
                        :key="item.code"
                    >
                        <span class="badge bg-dark ms-1">{{ item.display || item.code }}</span>
                    </template>
                </div>
            </div>
            <div
                v-if="extended"
                class="ms-3 d-flex flex-column justify-content-between mb-2 mt-2"
            >
                <template v-if="entity.matchingCriteria.simpleVariants">
                    <template
                        v-for="item in entity.matchingCriteria.simpleVariants"
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
                <template v-if="entity.matchingCriteria.copyNumberVariants">
                    <template
                        v-for="(item, key) in entity.matchingCriteria.copyNumberVariants"
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
                <template v-if="entity.matchingCriteria.dnaFusions">
                    <template
                        v-for="(item, key) in entity.matchingCriteria.dnaFusions"
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
                <template v-if="entity.matchingCriteria.rnaFusions">
                    <template
                        v-for="(item, key) in entity.matchingCriteria.rnaFusions"
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
        </div>
    </div>
</template>
