<script lang="ts">
import {
    DNav, DQueryInfoBox, DQueryPatientFilters, type QueryBase, injectQueryEventBus,
} from '@dnpm-dip/core';
import { QueryEventBusEventName } from '@dnpm-dip/core/services/query-event-bus/constants';
import { BModal } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import MQueryCriteriaSummary from '../../../components/core/query-criteria/MQueryCriteriaSummary.vue';
import MQueryCriteriaSummaryBox from '../../../components/core/query-criteria/MQueryCriteriaSummaryBox.vue';
import MQueryDiagnosisFilter from '../../../components/core/MQueryDiagnosisFilter.vue';
import MSearchForm from '../../../components/core/search/MSearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
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

            queryEventBus.emit(QueryEventBusEventName.SESSION_UPDATED, entity, 'mtb');
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        return {
            navItems,
            preparedQueryId: route.query.preparedQueryId,

            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-row mb-2">
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

    <div class="mb-2">
        <DNav
            :items="navItems"
            :path="'/mtb/query/'+ entity.id"
        />
    </div>

    <hr>

    <DQueryInfoBox
        :entity="entity"
        :link="'/mtb/query/' + entity.id + '/info'"
    />

    <template v-if="entity">
        <div class="row">
            <div class="col-6 col-md-9 col-lg-10">
                <div class="d-flex flex-column gap-3">
                    <div>
                        <MQueryCriteriaSummaryBox
                            :entity="entity"
                            @updated="handleUpdated"
                            @failed="handleFailed"
                        />
                    </div>
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
                    <DQueryPatientFilters
                        :available="entity.filters.patient"
                    />

                    <!--
                    <MQueryDiagnosisFilter
                        :available="entity.filters.diagnosis?.code"
                    />
                    -->
                </div>
            </div>
        </div>
    </template>
</template>
