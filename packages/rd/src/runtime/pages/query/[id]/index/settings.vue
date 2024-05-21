<script lang="ts">
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
        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);
        };

        return {
            preparedQueryId: route.query.preparedQueryId,
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
    />
</template>
