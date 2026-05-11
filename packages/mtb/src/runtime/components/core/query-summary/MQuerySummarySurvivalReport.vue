<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MQueryKaplanMeierPicker from '../MQueryKaplanMeierPicker.vue';
import MQueryKaplanMeierStatistic from '../MQueryKaplanMeierStatistic.vue';

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
    },
    setup() {
        const type = ref('');
        const grouping = ref('');

        const handlePicked = (ctx: { type: string, grouping: string }) => {
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
