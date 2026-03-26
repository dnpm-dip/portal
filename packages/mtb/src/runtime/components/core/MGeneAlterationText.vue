<!--
  - Copyright (c) 2026.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { QueryGeneAlteration } from '../../domains/index';
import { queryGeneAlterationToString } from '../../domains/index';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<QueryGeneAlteration>,
            required: true,
        },
    },
    setup(props) {
        const text = computed(() => queryGeneAlterationToString(props.entity));

        return { text };
    },
});
</script>
<template>
    {{ text }}
</template>
