<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import type { PatientMatch } from '../../domains';
import MQueryCriteriaSummary from './MQueryCriteriaSummary.vue';

export default defineComponent({
    components: {
        MQueryCriteriaSummary,
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
        <div
            class=" mb-2 mt-2"
            :class="{'d-flex flex-row': extended}"
        >
            <div
                class="d-flex justify-content-between"
                :class="{'flex-row': !extended, 'flex-column me-3': extended}"
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
            <template v-if="extended && entity.matchingCriteria">
                <MQueryCriteriaSummary
                    :entity="entity.matchingCriteria"
                    :direction="'horizontal'"
                />
            </template>
        </div>
    </div>
</template>
