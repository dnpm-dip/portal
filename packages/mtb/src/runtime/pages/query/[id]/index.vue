<script lang="ts">
import { computed, ref } from 'vue';
import {
    DNav, DQueryFilterContainer, DQueryInfoBox, DQueryPatientFilters, type QueryBase, injectQueryEventBus,
} from '@dnpm-dip/core';
import { QueryEventBusEventName } from '@dnpm-dip/core/services/query-event-bus/constants';
import { BModal } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import MQueryCriteriaModal from '../../../components/core/query-criteria/MQueryCriteriaModal.vue';
import MQueryCriteriaSummary from '../../../components/core/query-criteria/MQueryCriteriaSummary.vue';
import MQueryCriteriaSummaryBox from '../../../components/core/query-criteria/MQueryCriteriaSummaryBox.vue';
import MQueryDiagnosisFilter from '../../../components/core/query-filter/MQueryDiagnosisFilter.vue';
import MQueryMedicationFilter from '../../../components/core/query-filter/MQueryMedicationFilter.vue';
import MSearchForm from '../../../components/core/search/MSearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        MQueryCriteriaModal,
        DQueryFilterContainer,
        MQueryMedicationFilter,
        MQueryDiagnosisFilter,
        MQueryCriteriaSummaryBox,
        MQueryCriteriaSummary,
        BModal,
        MSearchForm,
        DQueryPatientFilters,
        DQueryInfoBox,
        DNav,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const route = useRoute();
        const queryEventBus = injectQueryEventBus();

        const criteriaExpansion = ref<boolean>(false);
        const toggleCriteriaExpansion = () => {
            criteriaExpansion.value = !criteriaExpansion.value;
        };

        const criteriaDefined = computed(() => {
            if (!props.entity.criteria) {
                return false;
            }

            const keys = Object.keys(props.entity.criteria);
            return keys.length > 0;
        });

        const initCriteriaExpansion = () => {
            criteriaExpansion.value = criteriaDefined.value;
        };

        initCriteriaExpansion();

        const navItems = [
            {
                name: 'Überblick', icon: 'fas fa-bars', urlSuffix: '/summary',
            },
            {
                name: 'Patienten', icon: 'fas fa-user-injured', urlSuffix: '/patients',
            },
            {
                name: 'Info', icon: 'fa fa-network-wired', urlSuffix: '/info',
            },
        ];

        const handleUpdated = (entity: QueryBase) => {
            emit('updated', entity);

            initCriteriaExpansion();

            queryEventBus.emit(QueryEventBusEventName.SESSION_UPDATED, entity, 'mtb');
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        return {
            criteriaDefined,
            criteriaExpansion,
            toggleCriteriaExpansion,

            navItems,
            preparedQueryId: route.query.preparedQueryId,

            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-row">
        <div>
            <h4>
                <NuxtLink
                    class="btn btn-xs btn-dark me-1"
                    :to="'/mtb/'"
                >
                    <i class="fa fa-arrow-left" />
                </NuxtLink>
                Abfrage
            </h4>
        </div>
    </div>

    <div class="d-flex flex-column gap-3">
        <div class="d-flex flex-row">
            <div>
                <DNav
                    :items="navItems"
                    :path="'/mtb/query/'+ entity.id"
                >
                    <template #end />
                </DNav>
            </div>
            <div class="ms-auto">
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <button
                            class="nav-link"
                            :class="{'active': criteriaExpansion }"
                            @click.prevent="toggleCriteriaExpansion"
                        >
                            <i class="fa fa-bars" /> Kriterien
                        </button>
                    </li>
                    <MQueryCriteriaModal
                        :entity="entity"
                        @updated="handleUpdated"
                        @failed="handleFailed"
                    >
                        <template #default="props">
                            <li class="nav-item">
                                <button
                                    class="nav-link"
                                    @click.prevent="props.toggle()"
                                >
                                    <i class="fa fa-cog" /> Anpassen
                                </button>
                            </li>
                        </template>
                    </MQueryCriteriaModal>
                </ul>
            </div>
        </div>

        <div v-if="criteriaExpansion">
            <div class="entity-card w-100">
                <template v-if="criteriaDefined">
                    <MQueryCriteriaSummary :entity="entity.criteria" />
                </template>
                <template v-else>
                    Es sind keine Suchkriterien definiert.
                </template>
            </div>
        </div>

        <DQueryInfoBox
            :entity="entity"
            :link="'/mtb/query/' + entity.id + '/info'"
        />

        <hr class="mt-0 mb-0">

        <template v-if="entity">
            <div class="row">
                <div class="col-6 col-md-9 col-lg-10">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <NuxtPage
                                :entity="entity"
                                @updated="handleUpdated"
                            />
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-3 col-lg-2">
                    <div class="d-flex flex-column gap-3">
                        <DQueryFilterContainer>
                            <template #default>
                                <DQueryPatientFilters
                                    :use-case="'mtb'"
                                    :query-id="entity.id"
                                />

                                <MQueryDiagnosisFilter
                                    :query-id="entity.id"
                                />

                                <MQueryMedicationFilter
                                    :query-id="entity.id"
                                    :type="'recommended'"
                                />

                                <MQueryMedicationFilter
                                    :query-id="entity.id"
                                    :type="'used'"
                                />
                            </template>
                        </DQueryFilterContainer>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
