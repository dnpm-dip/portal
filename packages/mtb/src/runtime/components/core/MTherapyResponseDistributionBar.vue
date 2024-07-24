<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { Coding, DistributionConceptsCount } from '@dnpm-dip/core';
import { type PropType, computed, defineComponent } from 'vue';
import { RecistColor } from '../../domains';

type Item = {
    name: string,
    percent: number,
    color: string
};

export default defineComponent({
    props: {
        distribution: {
            type: Object as PropType<DistributionConceptsCount<Coding<string>>>,
            required: true,
        },
    },
    setup(props) {
        const items = computed<Item[]>(() => {
            const output : Item[] = [];

            for (let i = 0; i < props.distribution.elements.length; i++) {
                const element = props.distribution.elements[i];

                output.push({
                    name: element.key.code,
                    percent: element.value.percent,
                    color: RecistColor[element.key.code as keyof typeof RecistColor],
                });
            }

            return output;
        });

        return {
            items,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-row distribution-bar">
        <template
            v-for="(item, key) in items"
            :key="key"
        >
            <div
                :style="{width: (100 * item.percent) + '%', 'background-color': item.color}"
            />
        </template>
    </div>
</template>
<style scoped>
.distribution-bar {
    height: 1rem;
    line-height: 1rem;
    background-color: #ececec;
    border: 1px solid #dedede;
    box-shadow: 0 4px 25px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
}
.distribution-bar div {
    height:100%;
    opacity: 0.8;
}
</style>
