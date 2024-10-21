<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { type ValueSetCoding } from '@dnpm-dip/core';
import { VCFormSelect } from '@vuecs/form-controls';
import { computed, defineComponent, ref } from 'vue';
import { injectHTTPClient } from '../../core/http-client';
import type { KaplanMeierOptions } from '../../domains';

export default defineComponent({
    components: { VCFormSelect },
    emits: ['failed', 'picked'],
    setup(props, { emit }) {
        const httpClient = injectHTTPClient();

        const busy = ref(false);
        const data = ref<KaplanMeierOptions[]>([]);

        const type = ref<string>('');
        const grouping = ref<string>('');

        const resolve = async () => {
            try {
                const response = await httpClient.kaplanMeier.getOptions();

                data.value = response.entries;
                type.value = response.defaults.type;
                grouping.value = response.defaults.grouping;
            } finally {
                busy.value = false;
            }
        };

        Promise.resolve()
            .then(resolve);

        const transformCoding = (coding: ValueSetCoding) => ({
            id: coding.code,
            value: coding.display ? `${coding.display}` : coding.code,
        });

        const typeOptions = computed(() => data.value.map((v) => transformCoding(v.key)));

        const groupingOptions = computed(() => {
            if (!type.value) {
                return [];
            }

            const index = data.value.findIndex((v) => v.key.code === type.value);
            if (index === -1) {
                return [];
            }

            return data.value[index].value.map((v) => transformCoding(v));
        });

        const handleTypeChanged = () => {
            grouping.value = '';
        };

        const handleGroupingChanged = () => {
            emit('picked', {
                type: type.value,
                grouping: grouping.value,
            });
        };

        return {
            data,
            busy,

            handleTypeChanged,
            handleGroupingChanged,

            type,
            typeOptions,

            grouping,
            groupingOptions,
        };
    },
});
</script>
<template>
    <div class="row">
        <div class="col">
            <VCFormGroup>
                <template #label>
                    Type
                </template>
                <template #default>
                    <VCFormSelect
                        v-model="type"
                        :disabled="busy"
                        :options="typeOptions"
                        placeholder="..."
                        @change="handleTypeChanged"
                    />
                </template>
            </VCFormGroup>
        </div>
        <div class="col">
            <VCFormGroup>
                <template #label>
                    Gruppierung
                </template>
                <template #default>
                    <VCFormSelect
                        v-model="grouping"
                        :disabled="busy || !type"
                        :options="groupingOptions"
                        placeholder="..."
                        @change="handleGroupingChanged"
                    />
                </template>
            </VCFormGroup>
        </div>
    </div>
</template>
