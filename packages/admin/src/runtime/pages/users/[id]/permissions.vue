<script lang="ts">
import {
    APagination, ASearch, AUserPermissionAssignment, AUserPermissionAssignments,
} from '@authup/client-web-kit';
import type { User } from '@authup/core-kit';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        ASearch,
        APagination,
        AUserPermissionAssignment,
        AUserPermissionAssignments,
    },
    props: {
        entity: {
            type: Object as PropType<User>,
            required: true,
        },
    },
});
</script>
<template>
    <AUserPermissionAssignments :entity-id="entity.id">
        <template #header="props">
            <ASearch
                :load="props.load"
                :meta="props.meta"
            />
        </template>
        <template #item="{ data }">
            <div class="d-flex flex-column w-100">
                <div class="d-flex flex-row gap-1 ">
                    <div>
                        <template v-if="data.display_name">
                            <strong>{{ data.display_name }}</strong> ({{ data.name }})
                        </template>
                        <template v-else>
                            <strong>{{ data.name }}</strong>
                        </template>
                    </div>
                    <div class="ms-auto">
                        <AUserPermissionAssignment
                            :key="data.id"
                            :user-id="entity.id"
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
    </AUserPermissionAssignments>
</template>
