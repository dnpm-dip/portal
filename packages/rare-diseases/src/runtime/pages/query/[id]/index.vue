<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { QuerySession } from '../../../domains/query';

export default defineNuxtComponent({
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup() {

    },
});
</script>
<template>
    <pre>{{ entity }}</pre>
</template>
