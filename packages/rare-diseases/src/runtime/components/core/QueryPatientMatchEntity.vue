<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { RDPatientMatch } from '../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<RDPatientMatch>,
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
                    :to="'/rd/query/'+ queryId + '/patients/' +entity.id"
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
                    <strong>Diagnose Kategorien</strong>

                    <template
                        v-for="item in entity.matchingCriteria.diagnoses"
                        :key="item.code"
                    >
                        <span class="badge bg-dark ms-1">{{ item.code }}</span>
                    </template>
                </div>
                <div v-if="entity.matchingCriteria.hpoTerms">
                    <strong>HPO Terme</strong>

                    <template
                        v-for="item in entity.matchingCriteria.hpoTerms"
                        :key="item.code"
                    >
                        <span class="badge bg-dark ms-1">{{ item.code }}</span>
                    </template>
                </div>
                <div v-if="entity.matchingCriteria.variants">
                    <strong>Varianten</strong>

                    <template
                        v-for="(item, key) in entity.matchingCriteria.variants"
                        :key="key"
                    >
                        <template
                            v-for="(value, prop) in item"
                            :key="prop"
                        >
                            <strong>{{ prop }}:</strong> {{ value }}
                        </template>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
