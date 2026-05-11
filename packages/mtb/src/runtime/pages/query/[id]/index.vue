<script lang="ts">
import { computed, ref } from 'vue';
import {
    DNav,
    DQueryFilterContainer,
    DQueryInfoBox,
    DQueryPatientFilters,
    type QueryBase,
    injectQueryEventBus,
} from '@dnpm-dip/core';
import { QueryEventBusEventName } from '@dnpm-dip/core/services/query-event-bus/constants';
import type { PropType } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import MQueryCriteriaModal from '../../../components/core/query-criteria/MQueryCriteriaModal.vue';
import MQueryCriteriaSummary from '../../../components/core/query-criteria/MQueryCriteriaSummary.vue';
import MQueryDiagnosisFilter from '../../../components/core/query-filter/MQueryDiagnosisFilter.vue';
import MQueryMedicationFilter from '../../../components/core/query-filter/MQueryMedicationFilter.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        MQueryCriteriaModal,
        DQueryFilterContainer,
        MQueryMedicationFilter,
        MQueryDiagnosisFilter,
        MQueryCriteriaSummary,
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
    emits: ['updated', 'failed'],
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
                name: 'Überblick',
                icon: 'fas fa-bars',
                urlSuffix: '/summary',
            },
            {
                name: 'Patienten',
                icon: 'fas fa-user-injured',
                urlSuffix: '/patients',
            },
            {
                name: 'Info',
                icon: 'fa fa-network-wired',
                urlSuffix: '/info',
            },
        ];

        const summaryNavItems = [
            {
                name: 'Demographie',
                icon: 'fas fa-globe',
                urlSuffix: '',
            },
            {
                name: 'Diagnose',
                icon: 'fas fa-stethoscope',
                urlSuffix: '/diagnostics',
            },
            {
                name: 'Medikation',
                icon: 'fas fa-pills',
                urlSuffix: '/medication',
            },
            {
                name: 'Therapie Responses',
                icon: 'fas fa-comment-medical',
                urlSuffix: '/therapy-responses',
            },
            {
                name: 'Gen Alterationen',
                icon: 'fas fa-dna',
                urlSuffix: '/gene-alterations',
            },
            {
                name: 'Überlebensbericht',
                icon: 'fas fa-book-open',
                urlSuffix: '/survival-report',
            },
        ];

        const isSummaryActive = computed(() => route.path.startsWith(`/mtb/query/${props.entity.id}/summary`));

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
            summaryNavItems,
            isSummaryActive,
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
        <div class="d-flex flex-column gap-2">
            <div class="d-flex flex-row">
                <div>
                    <DNav
                        :items="navItems"
                        :path="'/mtb/query/'+ entity.id"
                    >
                        <template #end />
                    </DNav>
                </div>
            </div>
            <div
                v-if="isSummaryActive"
                class="d-flex flex-row"
            >
                <div>
                    <DNav
                        :items="summaryNavItems"
                        :path="'/mtb/query/'+ entity.id + '/summary'"
                    />
                </div>
            </div>
        </div>

        <div class="entity-card w-100">
            <div class="d-flex flex-column gap-2">
                <div class="d-flex flex-row align-items-center">
                    <div>
                        <h6 class="text-muted mb-0">
                            Kriterien
                        </h6>
                    </div>
                    <div class="ms-auto d-flex gap-1">
                        <button
                            class="btn btn-dark btn-xs"
                            @click.prevent="toggleCriteriaExpansion"
                        >
                            <i :class="{'fa fa-chevron-down': !criteriaExpansion, 'fa fa-chevron-up': criteriaExpansion}" />
                        </button>
                        <MQueryCriteriaModal
                            :entity="entity"
                            @updated="handleUpdated"
                            @failed="handleFailed"
                        >
                            <template #default="props">
                                <button
                                    class="btn btn-dark btn-xs"
                                    @click.prevent="props.toggle()"
                                >
                                    <i class="fa fa-cog" />
                                </button>
                            </template>
                        </MQueryCriteriaModal>
                    </div>
                </div>
                <div v-show="criteriaExpansion">
                    <template v-if="criteriaDefined && entity.criteria">
                        <MQueryCriteriaSummary :entity="entity.criteria" />
                    </template>
                    <template v-else>
                        Es sind keine Suchkriterien definiert.
                    </template>
                </div>
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
