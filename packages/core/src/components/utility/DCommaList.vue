<!--
  - Copyright (c) 2025.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        items: {
            type: Array as PropType<string[]>,
            required: true,
        },
    },
});
</script>
<template>
    <template
        v-for="(item, index) in items"
        :key="item"
    >
        {{ index > 0 ? ',' : '' }} item
    </template>
</template>
