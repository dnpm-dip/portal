<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#imports';
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
        const handleUpdated = (entity: RDQuerySession) => {
            emit('updated', entity);
        };

        return {
            handleUpdated,
        };
    },
});
</script>
<template>
    <SearchForm
        :entity="entity"
        @updated="handleUpdated"
    />
</template>
