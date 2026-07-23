<script lang="ts">

import { AClientForm } from '@authup/client-web-kit';
import type { Client } from '@authup/core-kit';
import { PageMetaKey } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent, definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: { AClientForm },
    props: {
        entity: {
            type: Object as PropType<Client>,
            required: true,
        },
    },
    emits: ['updated', 'failed'],
    setup(_props, { emit }) {
        definePageMeta({ [PageMetaKey.REQUIRED_LOGGED_IN]: true });

        const handleUpdated = (e: Client) => {
            emit('updated', e);
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        return {
            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <div>
        <h6 class="title">
            Allgemein
        </h6>
        <AClientForm
            :entity="entity"
            :realm-id="entity.realmId"
            @updated="handleUpdated"
            @failed="handleFailed"
        />
    </div>
</template>
