<script lang="ts">

import {
    APagination,
    ARolePermissionAssignments,
    ASearch,
} from '@authup/client-web-kit';
import type { Role } from '@authup/core-kit';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        APagination,
        ASearch,
        ARolePermissionAssignments,
    },
    props: {
        entity: {
            type: Object as PropType<Role>,
            required: true,
        },
    },
});
</script>
<template>
    <ARolePermissionAssignments :entity-id="entity.id">
        <template #header="props">
            <ASearch
                :load="props.load"
                :meta="props.meta"
            />
        </template>

        <template #item="{ data }">
            <div class="flex flex-col w-full">
                <div>
                    <template v-if="data.displayName">
                        <strong>{{ data.displayName }}</strong> ({{ data.name }})
                    </template>
                    <template v-else>
                        <strong>{{ data.name }}</strong>
                    </template>
                </div>

                <div v-if="data.description">
                    {{ data.description }}
                </div>
            </div>
        </template>
        <template #footer="props">
            <APagination
                :busy="props.busy"
                :meta="props.meta"
                :load="props.load"
            />
        </template>
    </ARolePermissionAssignments>
</template>
