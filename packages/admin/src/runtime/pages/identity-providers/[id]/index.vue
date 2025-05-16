<script lang="ts">

import { AIdentityProviderLdapForm, AIdentityProviderOAuth2Form } from '@authup/client-web-kit';
import type { IdentityProvider } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { PageMetaKey } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { useRuntimeConfig } from '#app';
import { defineNuxtComponent, definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: {
        AIdentityProviderLdapForm,
        AIdentityProviderOAuth2Form,
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

        const handleUpdated = (e: IdentityProvider) => {
            emit('updated', e);
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const runtimeConfig = useRuntimeConfig();

        return {
            apiUrl: runtimeConfig.public.apiUrl as string,
            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <template v-if="entity.protocol === 'ldap'">
        <AIdentityProviderLdapForm
            :entity="entity"
            :realm-id="entity.realm_id"
            @updated="handleUpdated"
            @failed="handleFailed"
        />
    </template>
    <template v-else>
        <AIdentityProviderOAuth2Form
            :api-url="apiUrl"
            :entity="entity"
            :realm-id="entity.realm_id"
            @updated="handleUpdated"
            @failed="handleFailed"
        />
    </template>
</template>
