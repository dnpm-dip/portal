<script lang="ts">
import {
    type PropType,
} from 'vue';
import { defineNuxtComponent, navigateTo } from '#imports';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup(props) {
        navigateTo(`/rd/query/${props.entity.id}/summary`);
    },
});
</script>
<template>
    <div />
</template>
