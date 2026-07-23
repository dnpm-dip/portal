<script lang="ts">
import {
    APagination,
    ASearch,
    AUserRoleAssignments,
} from '@authup/client-web-kit';
import type { User } from '@authup/core-kit';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        ASearch,
        APagination,
        AUserRoleAssignments,
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
    <AUserRoleAssignments :entity-id="entity.id">
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
    </AUserRoleAssignments>
</template>
