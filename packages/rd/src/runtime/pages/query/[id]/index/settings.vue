<script lang="ts">
import { useToast } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import SearchForm from '../../../../components/core/RSearchForm.vue';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: { SearchForm },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup(_props, { emit }) {
        const route = useRoute();
        const toast = useToast();

        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);

            toast.show({
                body: 'Die Suche wurde erfolgreich aktualisiert.',
                variant: 'success',
            });
        };

        const handleFailed = (err: Error) => {
            toast.show({
                body: err.message,
                variant: 'warning',
            });
        };

        return {
            preparedQueryId: route.query.preparedQueryId,
            handleFailed,
            handleUpdated,
        };
    },
});
</script>
<template>
    <SearchForm
        :query-mode="entity.mode.code"
        :query-id="entity.id"
        :criteria="entity.criteria"
        :prepared-query-id="preparedQueryId"
        @query-updated="handleUpdated"
        @failed="handleFailed"
    />
</template>
