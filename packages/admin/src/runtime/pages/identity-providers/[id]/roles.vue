<script lang="ts">
import { AIdentityProviderRoleAssignments, APagination } from '@authup/client-web-kit';
import type { IdentityProvider } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { PageMetaKey } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent, definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: {
        APagination,
        AIdentityProviderRoleAssignments,
    },
    props: {
        entity: {
            type: Object as PropType<IdentityProvider>,
            required: true,
        },
    },
    emits: ['updated', 'failed'],
    setup(_props, { emit }) {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.IDENTITY_PROVIDER_UPDATE,
            ],
        });

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        return {
            handleFailed,
        };
    },
});
</script>
<template>
    <AIdentityProviderRoleAssignments
        :entity-id="entity.id"
        @failed="handleFailed"
    >
        <template #footer="props">
            <APagination
                :busy="props.busy"
                :meta="props.meta"
                :load="props.load"
            />
        </template>
    </AIdentityProviderRoleAssignments>
</template>
