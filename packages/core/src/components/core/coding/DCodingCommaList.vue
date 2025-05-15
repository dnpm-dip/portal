<!--
  - Copyright (c) 2025.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding } from '../../../domains';
import { DCommaList } from '../../utility';

export default defineComponent({
    components: { DCommaList },
    props: {
        items: {
            type: Array as PropType<Coding[]>,
            required: true,
        },
    },
    setup(props) {
        const formatted = computed(() => props.items.map((item) => {
            if (item.display) {
                return item.display;
            }

            return item.code;
        }));

        return {
            formatted,
        };
    },
});
</script>
<template>
    <DCommaList :items="formatted" />
</template>
