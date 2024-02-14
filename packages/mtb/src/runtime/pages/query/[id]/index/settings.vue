<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import MSearchForm from '../../../../components/core/MSearchForm.vue';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: { MSearchForm },
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
    <MSearchForm
        :query-mode="entity.mode.code"
        :query-id="entity.id"
        :criteria="entity.criteria"
        :prepared-query-id="preparedQueryId"
        @query-updated="handleUpdated"
    />
</template>
