<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { FormSelectOption } from '@vuecs/form-controls';
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
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
            type: Array as PropType<string[]>,
        },
    },
    emits: ['update:modelValue'],
    setup(props) {
        const httpClient = injectHTTPClient();

        const busy = ref(false);
        const items = ref<FormSelectOption[]>([]);
        const current = ref<FormSelectOption[]>([]);

        const transform = (input: Coding) : FormSelectOption => ({
            id: input.code,
            value: input.display || input.code,
        });

        const load = async () => {
            if (busy.value) return;

            busy.value = true;

            try {
                const response = await httpClient.site.getItems(props.useCase);

                items.value = [
                    transform(response.local),
                    ...response.others.map((o) => transform(o)),
                ];
            } finally {
                busy.value = false;
            }
        };

        const init = () => {
            if (props.modelValue) {
                return;
            }

            current.value = [
                ...items.value,
            ];
        };

        Promise.resolve()
            .then(() => load())
            .then(() => init());

        return {
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
        :disabled="busy"
    >
        <template #selected="props">
            <DTags
                :items="props.items"
                tag-variant="dark"
                @deleted="props.toggle"
            />
        </template>
    </VCFormSelectSearch>
</template>
