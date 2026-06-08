<script lang="ts">
import { DNav } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import { ref } from 'vue';
import {
    createError, 
    navigateTo, 
    useRoute,
} from '#app';
import { injectHTTPClient } from '../../../../core/http-client';
import type { PatientRecord, QuerySession } from '../../../../domains';

export default defineComponent({
    components: { DNav },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },

    async setup(props) {
        const api = injectHTTPClient();
        const route = useRoute();

        const entity = ref<null | PatientRecord>(null);

        if (typeof route.params.patientId !== 'string') {
            await navigateTo({ path: `/mtb/query/${props.entity.id}` });
            throw createError({});
        }

        try {
            entity.value = await api.query.getPatientRecord(props.entity.id, route.params.patientId);
        } catch {
            await navigateTo({ path: `/mtb/query/${props.entity.id}/patients` });
            throw createError({});
        }

        const navItems = [
            {
                name: 'Anamnese',
                icon: 'fa6-solid:bars',
                urlSuffix: '',
            },
            {
                name: 'Diagnostik',
                icon: 'fa6-solid:stethoscope',
                urlSuffix: '/diagnostics',
            },
            {
                name: 'Beschlüsse',
                icon: 'fa6-solid:gavel',
                urlSuffix: '/plans',
            },
            {
                name: 'Follow-UP',
                icon: 'fa6-solid:circle-arrow-up',
                urlSuffix: '/follow-up',
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
                    :to="'/mtb/query/'+ entity.id +'/patients'"
                >
                    <VCIcon name="fa6-solid:arrow-left" />
                </NuxtLink>
                Patient <small class="text-fg-muted"> {{ record.patient.id }}</small>
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
