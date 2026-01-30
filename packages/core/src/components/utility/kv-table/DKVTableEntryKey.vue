<!--
  - Copyright (c) 2026.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import type {KeyValueRecord} from "../../../domains";
import {generateChartLabelsForKeyValueRecord} from "../chart/utils";
export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<KeyValueRecord>,
            required: true
        }
    },
    setup(props) {
        const label = computed(() => {
            return generateChartLabelsForKeyValueRecord(props.entity) || 'Unknown';
        })

        return {
            label
        }
    }
})
</script>
<template>
    {{ label }}
</template>
