<script lang="ts">
import { DNav } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import { ref } from 'vue';
import {
    createError, 
    navigateTo, 
    useRoute,
} from '#app';
import { injectHTTPClient } from '../../../../core';
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

        const entity = ref<PatientRecord | null>(null);

        if (typeof route.params.patientId !== 'string') {
            await navigateTo({ path: `/rd/query/${props.entity.id}` });
            throw createError({});
        }

        try {
            entity.value = await api.query.getPatientRecord(props.entity.id, route.params.patientId);
        } catch {
            await navigateTo({ path: `/rd/query/${props.entity.id}` });
            throw createError({});
        }

        const navItems = [
            {
                name: 'Überblick',
                icon: 'fa6-solid:bars',
                urlSuffix: '',
            },
            {
                name: 'Diagnostik',
                icon: 'fa6-solid:stethoscope',
                urlSuffix: '/diagnostics',
            },
        ];

        return {
            navItems,
            record: entity.value as PatientRecord,
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
                    :to="'/rd/query/'+ entity.id"
                >
                    <VCIcon name="fa6-solid:arrow-left" />
                </NuxtLink>
                Patient <small class="text-fg-muted"> {{ record.patient.id }}</small>
            </h4>
        </div>

        <div class="mb-2">
            <DNav
                :items="navItems"
                :path="'/rd/query/'+ entity.id + '/patients/' + record.patient.id"
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
