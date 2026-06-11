<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import type { FormOption } from '@vuecs/forms';
import { VCFormSelectSearch } from '@vuecs/forms';
import type { PropType } from 'vue';
import {
    defineComponent,
    ref,
    toRef,
    watch,
} from 'vue';
import { injectHTTPClient } from '../../../core';
import type { Coding } from '../../../domains';

export default defineComponent({
    components: { VCFormSelectSearch },
    props: {
        useCase: {
            type: String,
            required: true,
        },
        modelValue: { type: Array as PropType<Coding[]> },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const modelValue = toRef(props, 'modelValue');
        const httpClient = injectHTTPClient();

        const busy = ref(false);
        const items = ref<FormOption[]>([]);
        const current = ref<string[]>([]);

        const transform = (input: Coding) : FormOption => ({
            value: input.code,
            label: input.display || input.code,
        });

        const load = wrapFnWithBusyState(busy, async () => {
            const response = await httpClient.site.getItems(props.useCase);

            items.value = [
                transform(response.local),
                ...response.others.map((o) => transform(o)),
            ];
        });

        const init = () => {
            if (props.modelValue) {
                current.value = props.modelValue.map((coding) => `${coding.code}`);

                return;
            }

            current.value = [];
        };

        const handleUpdated = (input: unknown) => {
            const values = Array.isArray(input) ? input : [];

            const data = values.map((value) => {
                const option = items.value.find((item) => item.value === value);

                return {
                    code: `${value}`,
                    display: option ? option.label : undefined,
                } satisfies Coding;
            });

            emit('update:modelValue', data);
        };

        Promise.resolve()
            .then(() => load())
            .then(() => init());

        watch(modelValue, () => {
            init();
        });

        return {
            handleUpdated,

            current,
            items,
            busy,
        };
    },
});
</script>
<template>
    <VCFormSelectSearch
        v-model="current"
        :options="items"
        :close-on-select="true"
        @change="handleUpdated"
    />
</template>
