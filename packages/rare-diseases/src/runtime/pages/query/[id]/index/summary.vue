<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import QuerySummaryEntity from '../../../../components/QuerySummaryEntity';
import type { RDQuerySession } from '../../../../domains/query';

export default defineNuxtComponent({
    components: { QuerySummaryEntity },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <QuerySummaryEntity
            :query-id="entity.id"
            :lazy="true"
        >
            <template #default="{data }">
                <div>
                    <div><strong><i class="fas fa-users" /> Total</strong> {{ data.numPatients }}</div>
                </div>
            </template>
        </QuerySummaryEntity>
    </div>
</template>
