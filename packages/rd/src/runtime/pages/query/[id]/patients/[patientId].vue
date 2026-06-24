<script lang="ts">
import { type PropType, computed, defineComponent } from 'vue';
import { ref } from 'vue';
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationItem } from '@vuecs/navigation';
import {
    createError, 
    navigateTo, 
    useRoute,
} from '#app';
import { injectHTTPClient } from '../../../../core';
import type { PatientRecord, QuerySession } from '../../../../domains';

export default defineComponent({
    components: { VCNavItems },
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

        const navItems = computed<NavigationItem[]>(() => {
            const base = `/rd/query/${props.entity.id}/patients/${entity.value?.patient.id}`;
            return [
                {
                    name: 'Überblick', 
                    icon: 'fa6-solid:bars', 
                    url: base, 
                },
                {
                    name: 'Diagnostik', 
                    icon: 'fa6-solid:stethoscope', 
                    url: `${base}/diagnostics`, 
                },
            ];
        });

        return {
            navItems,
            record: entity.value as PatientRecord,
        };
    },
});
</script>
<template>
    <div>
        <header class="mb-4 flex items-center gap-4">
            <span
                class="flex size-12 shrink-0 items-center justify-center rounded-xl
                       bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary shadow-md"
            >
                <VCIcon name="fa6-solid:hospital-user" />
            </span>
            <div class="min-w-0">
                <h1 class="mb-0 text-2xl font-bold tracking-tight">
                    Patient
                </h1>
                <p class="mb-0 truncate font-mono text-sm text-fg-muted">
                    {{ record.patient.id }}
                </p>
            </div>
            <NuxtLink
                class="btn btn-sm btn-secondary ms-auto"
                :to="'/rd/query/'+ entity.id + '/patients'"
            >
                <VCIcon name="fa6-solid:arrow-left" />
                Zu den Patienten
            </NuxtLink>
        </header>

        <div class="mb-3">
            <VCNavItems
                :data="navItems"
                variant="pills"
            />
        </div>

        <template v-if="record">
            <NuxtPage
                :entity="entity"
                :record="record"
            />
        </template>
    </div>
</template>
