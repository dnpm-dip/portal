<script lang="ts">
import {
    DChartBar, DChartDoughnut, DQuerySummaryDemographics, type NavItem, type URLQueryRecord,
} from '@dnpm-dip/core';
import type { PropType, Ref } from 'vue';
import { inject, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import MQuerySummary from '../../../../components/core/MQuerySummary';
import MQuerySummaryMedication from '../../../../components/core/MQuerySummaryMedication.vue';
import MQuerySummaryTumorDiagnostics from '../../../../components/core/MQuerySummaryTumorDiagnostics.vue';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        DQuerySummaryDemographics,
        MQuerySummaryMedication,
        MQuerySummaryTumorDiagnostics,
        DChartDoughnut,
        DChartBar,
        MQuerySummary,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup() {
        const navItems = [
            {
                id: 'default', name: 'Demographie', icon: 'fas fa-globe', urlSuffix: '',
            },
            {
                id: 'diagnostics', name: 'Diagnose', icon: 'fas fa-stethoscope', urlSuffix: '',
            },
            {
                id: 'medication', name: 'Medikamente', icon: 'fas fa-pills', urlSuffix: '',
            },
        ];

        const queryFilters = inject('queryFilters') as Ref<URLQueryRecord>;

        const navItemId = ref('default');

        const setNavItem = (item: NavItem) => {
            navItemId.value = item.id || 'default';
        };

        return {
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
            <ul class="nav nav-pills flex-column">
                <template
                    v-for="item in navItems"
                    :key="item.id"
                >
                    <li class="nav-item">
                        <a
                            href="javascript:void(0)"
                            class="nav-link"
                            :class="{'router-link-exact-active': navItemId === item.id}"
                            @click="setNavItem(item)"
                        >
                            <i :class="item.icon" />
                            {{ item.name }}
                        </a>
                    </li>
                </template>
            </ul>
        </div>
        <div class="content-main">
            <MQuerySummary
                :query-id="entity.id"
                :query-record="queryFilters"
            >
                <template #default="props">
                    <template v-if="navItemId === 'default'">
                        <DQuerySummaryDemographics :entity="props.data.demographics" />
                    </template>
                    <template v-else-if="navItemId === 'diagnostics'">
                        <MQuerySummaryTumorDiagnostics :entity="props.data.diagnostics" />
                    </template>
                    <template v-else>
                        <MQuerySummaryMedication :entity="props.data.medication" />
                    </template>
                </template>
            </MQuerySummary>
        </div>
    </div>
</template>
