<script lang="ts">
import { Nav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { ref } from 'vue';
import {
    createError, defineNuxtComponent, navigateTo, useRoute,
} from '#app';
import { useRDAPIClient } from '../../../../composables';
import type { RDPatientRecord, RDQuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: {
        Nav,
    },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },

    async setup(props) {
        const api = useRDAPIClient();
        const route = useRoute();

        const entity = ref<RDPatientRecord>(null) as any;

        if (typeof route.params.patientId !== 'string') {
            await navigateTo({ path: `/rd/query/${props.entity.id}` });
            throw createError({});
        }

        try {
            entity.value = await api.query.getPatientRecord(props.entity.id, route.params.patientId);
        } catch (e) {
            await navigateTo({ path: `/rd/query/${props.entity.id}` });
            throw createError({});
        }

        const navItems = [
            {
                name: 'Overview', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Reports', icon: 'fa-solid fa-newspaper', urlSuffix: '/reports',
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
        <h4 class="title">
            Patient <small class="sub-title text-muted"> {{ record.patient.id }}</small>
        </h4>

        <div class="mb-2">
            <Nav
                :items="navItems"
                :prev-link="'/rd/query/'+ entity.id"
                :path="'/rd/query/'+ entity.id + '/patients/' + record.patient.id"
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
