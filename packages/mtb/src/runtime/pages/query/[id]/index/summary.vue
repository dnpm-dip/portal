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
    type NavItem,
} from '@dnpm-dip/core';
import {
    type PropType,
} from 'vue';
import { inject, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import MQuerySummaryMedication from '../../../../components/core/MQuerySummaryMedication.vue';
import MQuerySummarySurvivalReport from '../../../../components/core/MQuerySummarySurvivalReport.vue';
import MQuerySummaryTumorDiagnostics from '../../../../components/core/MQuerySummaryTumorDiagnostics.vue';
import type { QuerySession } from '../../../../domains';

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
                id: 'therapyResponses', name: 'Therapie Responses', icon: 'fas fa-comment-medical', urlSuffix: '/therapy-responses',
            },
            {
                id: 'survivalReport', name: 'Überlebensbericht', icon: 'fas fa-book-open', urlSuffix: '/survival-report',
            },
        ];

        const navItemId = ref('default');

        const setNavItem = (item: NavItem) => {
            navItemId.value = item.id || 'default';
        };

        return {
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
                :entity="entity"
            />
        </div>
    </div>
</template>
