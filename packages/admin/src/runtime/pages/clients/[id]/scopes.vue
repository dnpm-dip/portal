<script lang="ts">

import {
    AClientScopeAssignments,
    APagination,
    ASearch,
} from '@authup/client-web-kit';
import type { Client } from '@authup/core-kit';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        APagination,
        ASearch,
        AClientScopeAssignments,
    },
    props: {
        entity: {
            type: Object as PropType<Client>,
            required: true,
        },
    },
});
</script>
<template>
    <AClientScopeAssignments :entity-id="entity.id">
        <template #header="props">
            <ASearch
                :load="props.load"
                :meta="props.meta"
            />
        </template>
        <template #footer="props">
            <APagination
                :busy="props.busy"
                :meta="props.meta"
                :load="props.load"
            />
        </template>
    </AClientScopeAssignments>
</template>
