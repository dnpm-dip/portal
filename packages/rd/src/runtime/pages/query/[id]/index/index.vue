<script lang="ts">
import { DQuerySummaryDemographics, type NavItem, type URLQueryRecord } from '@dnpm-dip/core';
import {
    type PropType, type Ref, nextTick, watch,
} from 'vue';
import { inject, ref } from 'vue';
import CollectionTransform from '@dnpm-dip/core/components/utility/DCollectionTransform.vue';
import { defineNuxtComponent } from '#imports';
import QuerySummaryEntity from '../../../../components/core/RQuerySummary';
import RQuerySummaryDiagnostics from '../../../../components/core/RQuerySummaryDiagnostics.vue';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        DQuerySummaryDemographics,
        RQuerySummaryDiagnostics,
        CollectionTransform,
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
                id: 'variant', name: 'Diagnostik', icon: 'fas fa-stethoscope', urlSuffix: '/patients',
            },
        ];

        const entityRef = ref(null) as Ref<typeof QuerySummaryEntity | null>;
        const queryFilters = inject('queryFilters') as Ref<URLQueryRecord>;
        watch(queryFilters, () => {
            nextTick(() => {
                if (entityRef.value) {
                    entityRef.value.load(true);
                }
            });
        }, { deep: true });

        const navItemId = ref('default');

        const setNavItem = (item: NavItem) => {
            navItemId.value = item.id || 'default';
        };

        return {
            entityRef,
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
                ref="entityRef"
                :query-id="entity.id"
                :query-record="queryFilters"
            >
                <template #default="props">
                    <template v-if="navItemId === 'default'">
                        <DQuerySummaryDemographics :entity="props.data.demographics" />
                    </template>

                    <template v-else>
                        <RQuerySummaryDiagnostics :entity="props.data.diagnostics" />
                    </template>
                </template>
            </QuerySummaryEntity>
        </div>
    </div>
</template>
