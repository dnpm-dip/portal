<script lang="ts">
import { computed, ref, resolveComponent } from 'vue';
import {
    DQueryFilterContainer,
    DQueryInfoBox,
    DQueryPatientFilters,
    type QueryBase,
    injectQueryEventBus,
} from '@dnpm-dip/core';
import { QueryEventBusEventName } from '@dnpm-dip/core/services/query-event-bus/constants';
import type { PropType } from 'vue';
import { VCButton } from '@vuecs/button';
import { VCIcon } from '@vuecs/icon';
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationItem } from '@vuecs/navigation';
import { defineNuxtComponent, useRoute } from '#imports';
import MQueryCriteriaModal from '../../../components/core/query-criteria/MQueryCriteriaModal.vue';
import MQueryCriteriaSummary from '../../../components/core/query-criteria/MQueryCriteriaSummary.vue';
import MQueryDiagnosisFilter from '../../../components/core/query-filter/MQueryDiagnosisFilter.vue';
import MQueryMedicationFilter from '../../../components/core/query-filter/MQueryMedicationFilter.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        VCButton,
        VCIcon,
        VCNavItems,
        MQueryCriteriaModal,
        DQueryFilterContainer,
        MQueryMedicationFilter,
        MQueryDiagnosisFilter,
        MQueryCriteriaSummary,
        DQueryPatientFilters,
        DQueryInfoBox,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    emits: ['updated', 'failed'],
    setup(props, { emit }) {
        const NuxtLink = resolveComponent('NuxtLink');
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

        const navItems = computed<NavigationItem[]>(() => [
            {
                name: 'Überblick', 
                icon: 'fa6-solid:bars', 
                url: `/mtb/query/${props.entity.id}/summary`, 
            },
            {
                name: 'Patienten', 
                icon: 'fa6-solid:user-injured', 
                url: `/mtb/query/${props.entity.id}/patients`, 
            },
            {
                name: 'Info', 
                icon: 'fa6-solid:network-wired', 
                url: `/mtb/query/${props.entity.id}/info`, 
            },
        ]);

        const summaryNavItems = computed<NavigationItem[]>(() => [
            {
                name: 'Demographie', 
                icon: 'fa6-solid:globe', 
                url: `/mtb/query/${props.entity.id}/summary`, 
            },
            {
                name: 'Diagnose', 
                icon: 'fa6-solid:stethoscope', 
                url: `/mtb/query/${props.entity.id}/summary/diagnostics`, 
            },
            {
                name: 'Gen Alterationen',
                icon: 'fa6-solid:dna',
                url: `/mtb/query/${props.entity.id}/summary/gene-alterations`,
            },
            {
                name: 'Medikation',
                icon: 'fa6-solid:pills',
                url: `/mtb/query/${props.entity.id}/summary/medication`,
            },
            {
                name: 'Therapie Responses', 
                icon: 'fa6-solid:comment-medical', 
                url: `/mtb/query/${props.entity.id}/summary/therapy-responses`, 
            },
            {
                name: 'Überlebensbericht',
                icon: 'fa6-solid:book-open',
                url: `/mtb/query/${props.entity.id}/summary/survival-report`,
            },
        ]);

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
            NuxtLink,
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
    <header class="mb-4 flex items-center gap-4">
        <span
            class="flex size-12 shrink-0 items-center justify-center rounded-xl
                   bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary shadow-md"
        >
            <VCIcon name="fa6-solid:magnifying-glass-chart" />
        </span>
        <div class="min-w-0">
            <h1 class="mb-0 text-2xl font-bold tracking-tight">
                Abfrage
            </h1>
            <p class="mb-0 text-sm text-fg-muted">
                Molekulares Tumorboard
            </p>
        </div>
        <VCButton
            :as="NuxtLink"
            :to="'/mtb/'"
            size="sm"
            color="neutral"
            variant="soft"
            class="ms-auto"
        >
            <VCIcon name="fa6-solid:arrow-left" />
            Zur Suche
        </VCButton>
    </header>

    <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2">
            <div class="flex flex-row">
                <div>
                    <VCNavItems
                        :data="navItems"
                        variant="pills"
                    />
                </div>
            </div>
            <div
                v-if="isSummaryActive"
                class="flex flex-row"
            >
                <div>
                    <VCNavItems
                        :data="summaryNavItems"
                        variant="pills"
                    />
                </div>
            </div>
        </div>

        <div class="entity-card w-full">
            <div class="flex flex-col gap-2">
                <div class="flex flex-row items-center">
                    <div>
                        <h6 class="section-label mb-0">
                            <VCIcon name="fa6-solid:list-check" />
                            Kriterien
                        </h6>
                    </div>
                    <div class="ms-auto flex gap-1">
                        <VCButton
                            color="neutral"
                            size="xs"
                            @click.prevent="toggleCriteriaExpansion"
                        >
                            <VCIcon :name="criteriaExpansion ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                        </VCButton>
                        <MQueryCriteriaModal
                            :entity="entity"
                            @updated="handleUpdated"
                            @failed="handleFailed"
                        >
                            <template #default="props">
                                <VCButton
                                    color="neutral"
                                    size="xs"
                                    @click.prevent="props.toggle()"
                                >
                                    <VCIcon name="fa6-solid:pen-to-square" /> Anpassen
                                </VCButton>
                            </template>
                        </MQueryCriteriaModal>
                    </div>
                </div>
                <div v-show="criteriaExpansion">
                    <template v-if="criteriaDefined && entity.criteria">
                        <MQueryCriteriaSummary :entity="entity.criteria" />
                    </template>
                    <template v-else>
                        <p class="mb-0 text-sm text-fg-muted">
                            Es sind keine Suchkriterien definiert.
                        </p>
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
            <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2 md:w-9/12 lg:w-10/12">
                    <div class="flex flex-col gap-3">
                        <div>
                            <NuxtPage
                                :entity="entity"
                                @updated="handleUpdated"
                            />
                        </div>
                    </div>
                </div>
                <div class="w-full px-2 md:w-3/12 lg:w-2/12">
                    <div class="flex flex-col gap-3">
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
