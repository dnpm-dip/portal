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
import { injectHTTPClient } from '../../../../core/http-client';
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
            <VCNavItems
                :data="navItems"
                variant="pills"
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
