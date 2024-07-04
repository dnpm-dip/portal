<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    DChartBar,
    DChartDoughnut,
    DChartLineKM,
    DNav,
    DQuerySummaryDemographics,
    InjectionKey,
    type NavItem,
    type URLQueryRecord, createResourceRecordManager,
} from '@dnpm-dip/core';
import {
    type PropType, type Ref, nextTick, watch,
} from 'vue';
import { inject, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import MQuerySummary from '../../../../components/core/MQuerySummary';
import MQuerySummaryMedication from '../../../../components/core/MQuerySummaryMedication.vue';
import MQuerySummarySurvivalReport from '../../../../components/core/MQuerySummarySurvivalReport.vue';
import MQuerySummaryTumorDiagnostics from '../../../../components/core/MQuerySummaryTumorDiagnostics.vue';
import type { QuerySession } from '../../../../domains';
import { injectHTTPClient } from '../../../../core/http-client';

export default defineNuxtComponent({
    components: {
        DNav,
        MQuerySummarySurvivalReport,
        DQuerySummaryDemographics,
        MQuerySummaryMedication,
        MQuerySummaryTumorDiagnostics,
        DChartDoughnut,
        DChartBar,
        DChartLineKM,
        MQuerySummary,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    async setup(props) {
        const navItems = [
            {
                id: 'default', name: 'Demographie', icon: 'fas fa-globe', urlSuffix: '',
            },
            {
                id: 'diagnostics', name: 'Diagnose', icon: 'fas fa-stethoscope', urlSuffix: '/diagnostics',
            },
            {
                id: 'medication', name: 'Medikation', icon: 'fas fa-pills', urlSuffix: '/medication',
            },
            {
                id: 'survivalReport', name: 'Überlebensbericht', icon: 'fas fa-book-open', urlSuffix: '/survival-report',
            },
        ];

        const httpClient = injectHTTPClient();

        const queryFilters = inject(InjectionKey.QUERY_FILTERS) as Ref<URLQueryRecord>;
        const queryUpdatedAt = inject(InjectionKey.QUERY_UPDATED_AT) as Ref<string>;

        const manager = createResourceRecordManager({
            load: (id) => httpClient.query.getSummary(id, queryFilters.value),
            id: props.entity.id,
        });

        await manager.load();

        watch(queryFilters, () => {
            nextTick(() => {
                manager.load(true);
            });
        }, { deep: true });

        watch(queryUpdatedAt, () => {
            manager.load(true);
        });

        const navItemId = ref('default');

        const setNavItem = (item: NavItem) => {
            navItemId.value = item.id || 'default';
        };

        return {
            data: manager.data,

            queryFilters,
            navItems,
            navItemId,
            setNavItem,
        };
    },
});
</script>
<template>
    <div class="content-wrapper">
        <div class="content-sidebar">
            <DNav
                :direction="'vertical'"
                :items="navItems"
                :path="'/mtb/query/'+ entity.id + '/summary'"
            />
        </div>
        <div class="content-main">
            <NuxtPage
                :entity="data"
            />
        </div>
    </div>
</template>
