<script lang="ts">
import { APIClientErrorBox } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { ref } from 'vue';
import { defineNuxtComponent, navigateTo } from '#app';
import SearchForm from '../components/SearchForm.vue';
import type { RDQuerySession } from '../domains/query';

export default defineNuxtComponent({
    components: {
        APIClientErrorBox,
        SearchForm,
    },
    setup() {
        const error = ref<null | ClientError>(null);
        const handleFailed = (e: ClientError) => {
            error.value = e;
        };

        const handleCreated = async (data: RDQuerySession) => {
            error.value = null;

            await navigateTo({ path: `/rd/query/${data.id}` });
        };

        return {
            error,
            handleCreated,
            handleFailed,
        };
    },
});
</script>

<template>
    <div>
        <h1><i class="fa fa-search" /> Search</h1>

        <SearchForm
            @created="handleCreated"
            @failed="handleFailed"
        />

        <template v-if="error">
            <APIClientErrorBox :error="error" />
        </template>
    </div>
</template>
