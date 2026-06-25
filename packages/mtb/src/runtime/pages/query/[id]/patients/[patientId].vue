<script lang="ts">
import { 
    type PropType, 
    computed, 
    defineComponent, 
    resolveComponent, 
} from 'vue';
import { ref } from 'vue';
import { VCButton } from '@vuecs/button';
import { VCIcon } from '@vuecs/icon';
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationItem } from '@vuecs/navigation';
import {
    createError, 
    navigateTo, 
    useRoute,
} from '#app';
import { injectHTTPClient } from '../../../../core/http-client';
import type { PatientRecord, QuerySession } from '../../../../domains';

export default defineComponent({
    components: {
        VCButton, 
        VCIcon, 
        VCNavItems, 
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },

    async setup(props) {
        const NuxtLink = resolveComponent('NuxtLink');
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

        const navItems = computed<NavigationItem[]>(() => {
            const base = `/mtb/query/${props.entity.id}/patients/${entity.value?.patient.id}`;
            return [
                {
                    name: 'Anamnese', 
                    icon: 'fa6-solid:bars', 
                    url: base, 
                },
                {
                    name: 'Diagnostik', 
                    icon: 'fa6-solid:stethoscope', 
                    url: `${base}/diagnostics`, 
                },
                {
                    name: 'Beschlüsse', 
                    icon: 'fa6-solid:gavel', 
                    url: `${base}/plans`, 
                },
                {
                    name: 'Follow-UP', 
                    icon: 'fa6-solid:circle-arrow-up', 
                    url: `${base}/follow-up`, 
                },
            ];
        });

        return {
            NuxtLink,
            navItems,
            record: entity.value,
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
            <VCButton
                :as="NuxtLink"
                :to="'/mtb/query/'+ entity.id +'/patients'"
                size="sm"
                color="neutral"
                variant="soft"
                class="ms-auto"
            >
                <VCIcon name="fa6-solid:arrow-left" />
                Zu den Patienten
            </VCButton>
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
