<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { BTooltip } from 'bootstrap-vue-next';
import { type Coding, type DistributionConceptsCount, isCoding } from '@dnpm-dip/core';
import { type PropType, computed, defineComponent } from 'vue';
import { RecistColor } from '../../domains';

type Item = {
    title: string,
    code: string,
    percent: number,
    color: string
};

export default defineComponent({
    directives: {
        BTooltip,
    },
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

                let code : string | undefined;
                let title : string | undefined;

                if (isCoding(element.key)) {
                    title = element.key.display || element.key.code;
                    code = element.key.code;
                } else if (typeof element.key === 'string') {
                    title = element.key;
                    code = element.key;
                }

                output.push({
                    title: `${title} (${element.value.count}/${props.distribution.total}; ${Math.round(element.value.percent)}%)`,
                    code,
                    percent: element.value.percent,
                    color: RecistColor[code as keyof typeof RecistColor],
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
    <div class="d-flex flex-column distribution-bar">
        <template
            v-for="(item, key) in items"
            :key="key"
        >
            <div
                v-b-tooltip.hover.top
                :title="item.title"
                :style="{
                    height: (item.percent * 1.25) + 'px',
                    'background-color': item.color
                }"
            >
                {{ item.code }}
            </div>
        </template>
    </div>
</template>
<style scoped>
.distribution-bar {
    width: 100%;
    height: 120px;
    line-height: 1rem;
    font-size: 0.65rem;
    background-color: #ececec;
    border: 1px solid #dedede;
    box-shadow: 0 4px 25px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    vertical-align: center;
}

.distribution-bar div {
    width:100%;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
