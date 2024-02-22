<script lang="ts">
import { DChartLineKM } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';

export default defineComponent({
    components: {
        DChartLineKM,
    },
    props: {
        items: {
            type: Array as PropType<Record<string, any>[]>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <h5>Überlebensbericht</h5>
        <template
            v-for="(item, key) in items"
            :key="key"
        >
            <div class="entity-card text-center mb-3 w-100">
                <h6>{{ item.survivalType.display }} (Gruppierung: {{ item.grouping.display }})</h6>

                <DChartLineKM :report="item" />
            </div>
        </template>
    </div>
</template>
