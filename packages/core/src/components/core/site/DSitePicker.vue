<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import type { FormSelectOption } from '@vuecs/form-controls';
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { PropType } from 'vue';
import {
    defineComponent, ref, toRef, watch,
} from 'vue';
import { injectHTTPClient } from '../../../core';
import type { Coding } from '../../../domains';
import { DTags } from '../../utility';

export default defineComponent({
    components: {
        DTags,
        VCFormSelectSearch,
    },
    props: {
        useCase: {
            type: String,
            required: true,
        },
        modelValue: {
            type: Array as PropType<Coding[]>,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const modelValue = toRef(props, 'modelValue');
        const httpClient = injectHTTPClient();

        const busy = ref(false);
        const items = ref<FormSelectOption[]>([]);
        const current = ref<FormSelectOption[]>([]);

        const transform = (input: Coding) : FormSelectOption => ({
            id: input.code,
            value: input.display || input.code,
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
                current.value = props.modelValue.map((coding) => ({
                    id: coding.code,
                    value: coding.display || coding.code,
                }satisfies FormSelectOption));

                return;
            }

            current.value = [];
        };

        const handleUpdated = (value: FormSelectOption[]) => {
            const data = value.map((item) => ({
                code: `${item.id}`,
                display: item.value,
            } satisfies Coding));

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
        @change="handleUpdated"
    >
        <template #selected="props">
            <DTags
                :emit-only="true"
                :items="props.items"
                tag-variant="dark"
                @deleted="props.toggle"
            />
        </template>
    </VCFormSelectSearch>
</template>
