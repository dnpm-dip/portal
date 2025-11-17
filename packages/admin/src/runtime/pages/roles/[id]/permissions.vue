<script lang="ts">

import {
    APagination, ARolePermissionAssignment, ARolePermissionAssignments, ASearch,
} from '@authup/client-web-kit';
import type { Role } from '@authup/core-kit';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        APagination,
        ASearch,
        ARolePermissionAssignment,
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
            <div class="d-flex flex-column w-100">
                <div class="d-flex flex-row gap-1">
                    <div>
                        <template v-if="data.display_name">
                            <strong>{{ data.display_name }}</strong> ({{ data.name }})
                        </template>
                        <template v-else>
                            <strong>{{ data.name }}</strong>
                        </template>
                    </div>
                    <div class="ms-auto">
                        <ARolePermissionAssignment
                            :key="data.id"
                            :role-id="entity.id"
                            :permission-id="data.id"
                        />
                    </div>
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
