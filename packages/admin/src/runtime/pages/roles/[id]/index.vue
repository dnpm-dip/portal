<script lang="ts">

import { ARoleForm } from '@authup/client-web-kit';
import type { Role } from '@authup/core-kit';
import { PageMetaKey } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent, definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: {
        ARoleForm,
    },
    props: {
        entity: {
            type: Object as PropType<Role>,
            required: true,
        },
    },
    emits: ['updated', 'failed'],
    setup(_props, { emit }) {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
        });

        const handleUpdated = (e: Role) => {
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
            General
        </h6>
        <ARoleForm
            :entity="entity"
            @update="handleUpdated"
            @failed="handleFailed"
        />
    </div>
</template>
