<script lang="ts">
import { APIClientErrorBox } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { ref } from 'vue';
import { defineNuxtComponent } from '#app';
import SearchForm from '../components/SearchForm.vue';
import type { QuerySession } from '../domains/query';

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

        const handleCreated = (data: QuerySession) => {
            error.value = null;

            // todo: redirect to query overview page
            console.log(data);
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
