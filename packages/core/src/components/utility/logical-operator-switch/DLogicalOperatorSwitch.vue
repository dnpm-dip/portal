<!--
  - Copyright (c) 2024-2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { PropType } from 'vue';
import {
    defineComponent, ref, toRef, watch,
} from 'vue';
import { LogicalOperator } from '../../../constants';

export default defineComponent({
    props: {
        modelValue: {
            type: String as PropType<`${LogicalOperator}`>,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const operator = ref<`${LogicalOperator}`>(`${LogicalOperator.OR}`);
        const operatorProp = toRef(props, 'modelValue');
        if (operatorProp.value) {
            operator.value = operatorProp.value;
        }

        watch(operator, (val, oldValue) => {
            if (val !== oldValue) {
                operator.value = val;
            }
        });

        const toggle = () => {
            operator.value = operator.value === LogicalOperator.OR ?
                LogicalOperator.AND :
                LogicalOperator.OR;

            emit('update:modelValue', operator.value);
        };

        return {
            toggle,
            operator,
        };
    },
});
</script>
<template>
    <button
        type="button"
        class="btn btn-secondary"
        @click.prevent="toggle"
    >
        <template v-if="operator === 'and'">
            ∩
        </template>
        <template v-else>
            ∪
        </template>
    </button>
</template>
