<script lang="ts">
import {
    DNav, DQueryInfoBox, DQueryPatientFilters, injectQueryEventBus,
} from '@dnpm-dip/core';
import { QueryEventBusEventName } from '@dnpm-dip/core/services/query-event-bus/constants';
import { BModal } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import MQueryCriteriaSummary from '../../../components/core/MQueryCriteriaSummary.vue';
import MQueryCriteriaSummaryBox from '../../../components/core/MQueryCriteriaSummaryBox.vue';
import MSearchForm from '../../../components/core/MSearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
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

        const handleSubmit = () => {
            // do nothing
        };

        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);

            queryEventBus.emit(QueryEventBusEventName.SESSION_UPDATED, entity, 'mtb');
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        return {
            handleSubmit,
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
                <DQueryPatientFilters
                    class="mb-3"
                    :available-filters="entity.filters.patient"
                    @submit="handleSubmit"
                />
            </div>
        </div>
    </template>
</template>
