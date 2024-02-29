<script lang="ts">
import { DNav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { ref } from 'vue';
import {
    createError, defineNuxtComponent, navigateTo, useRoute,
} from '#app';
import { useMTBAPIClient } from '../../../../composables';
import type { PatientRecord, QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        DNav,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },

    async setup(props) {
        const api = useMTBAPIClient();
        const route = useRoute();

        const entity = ref<PatientRecord>(null) as any;

        if (typeof route.params.patientId !== 'string') {
            await navigateTo({ path: `/mtb/query/${props.entity.id}` });
            throw createError({});
        }

        try {
            entity.value = await api.query.getPatientRecord(props.entity.id, route.params.patientId);
        } catch (e) {
            await navigateTo({ path: `/mtb/query/${props.entity.id}` });
            throw createError({});
        }

        const navItems = [
            {
                name: 'Überblick', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Diagnostik', icon: 'fas fa-stethoscope', urlSuffix: '/diagnostics',
            },
            {
                name: 'Beschlüsse', icon: 'fas fa-gavel', urlSuffix: '/plans',
            },
            {
                name: 'Follow-UP', icon: 'fas fa-arrow-circle-up', urlSuffix: '/follow-up',
            },
        ];

        return {
            navItems,
            record: entity.value,
        };
    },
});
</script>
<template>
    <div>
        <div class="mb-2">
            <h4>
                <NuxtLink
                    class="btn btn-xs btn-dark me-1"
                    :to="'/mtb/query/'+ entity.id"
                >
                    <i class="fa fa-arrow-left" />
                </NuxtLink>
                Patient <small class="text-muted"> {{ record.patient.id }}</small>
            </h4>
        </div>

        <div class="mb-2">
            <DNav
                :items="navItems"
                :path="'/mtb/query/'+ entity.id + '/patients/' + record.patient.id"
            />
        </div>

        <hr>

        <template v-if="record">
            <NuxtPage
                :entity="entity"
                :record="record"
            />
        </template>
    </div>
</template>
