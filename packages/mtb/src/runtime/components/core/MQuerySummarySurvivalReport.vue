<script lang="ts">
import { type PropType, defineComponent, ref } from 'vue';
import MQueryKaplanMeierPicker from './MQueryKaplanMeierPicker.vue';
import MQueryKaplanMeierStatistic from './MQueryKaplanMeierStatistic.vue';

export default defineComponent({
    components: {
        MQueryKaplanMeierStatistic,
        MQueryKaplanMeierPicker,
    },
    props: {
        queryId: {
            type: String,
            required: true,
        },
        items: {
            type: Array as PropType<Record<string, any>[]>,
            required: true,
        },
    },
    setup() {
        const type = ref('');
        const grouping = ref('');

        const handlePicked = (ctx: {type: string, grouping: string}) => {
            type.value = ctx.type;
            grouping.value = ctx.grouping;
        };

        return {
            type,
            grouping,
            handlePicked,
        };
    },
});
</script>
<template>
    <div>
        <h5>Überlebensbericht</h5>

        <MQueryKaplanMeierPicker
            class="mb-3"
            @picked="handlePicked"
        />

        <MQueryKaplanMeierStatistic
            :query-id="queryId"
            :type="type"
            :grouping="grouping"
        />
    </div>
</template>
