<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import SearchForm from '../../../../components/core/SearchForm.vue';
import type { RDQuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: { SearchForm },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
    setup(_props, { emit }) {
        const route = useRoute();
        const handleUpdated = (entity: RDQuerySession) => {
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
        :criteria="entity.criteria"
        :query-id="entity.id"
        :prepared-query-id="preparedQueryId"
        @updated="handleUpdated"
    />
</template>
