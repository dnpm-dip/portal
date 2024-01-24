<script lang="ts">
import type { NavItem, URLQueryRecord } from '@dnpm-dip/core';
import type { PropType, Ref } from 'vue';
import { inject, ref } from 'vue';
import CollectionTransform from '@dnpm-dip/core/components/utility/DCollectionTransform.vue';
import { DChartBar, DChartDoughnut } from '@dnpm-dip/core';
import { defineNuxtComponent } from '#imports';
import QuerySummaryEntity from '../../../../components/core/QuerySummaryEntity';
import RQuerySummaryDiagnostics from '../../../../components/core/RQuerySummaryDiagnostics.vue';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        RQuerySummaryDiagnostics,
        CollectionTransform,
        DChartBar,
        DChartDoughnut,
        QuerySummaryEntity,
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
                id: 'variant', name: 'Diagnostik', icon: 'fas fa-puzzle-piece', urlSuffix: '/patients',
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
            <QuerySummaryEntity
                :query-id="entity.id"
                :query-record="queryFilters"
            >
                <template #default="props">
                    <template v-if="navItemId === 'default'">
                        <div>
                            <h5>Allgemein</h5>
                            <div class="row">
                                <div class="col-12 col-xl-4">
                                    <div class="entity-card text-center mb-3 w-100">
                                        <h6>
                                            Patienten pro Standort
                                        </h6>
                                        <DChartDoughnut
                                            style="max-height: 390px"
                                            :items="props.data.demographics.siteDistribution"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-4">
                                    <div class="entity-card text-center mb-3 w-100">
                                        <h6>
                                            Verteilung von Geschlechtern
                                        </h6>
                                        <DChartDoughnut
                                            style="max-height: 390px"
                                            :items="props.data.demographics.genderDistribution"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-4">
                                    <div class="entity-card text-center mb-3 w-100">
                                        <h6>
                                            Verteilung des Alters
                                        </h6>
                                        <DChartBar
                                            style="max-height: 390px"
                                            :items="props.data.demographics.ageDistribution"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <RQuerySummaryDiagnostics :entity="props.data.diagnostics" />
                    </template>
                </template>
            </QuerySummaryEntity>
        </div>
    </div>
</template>
