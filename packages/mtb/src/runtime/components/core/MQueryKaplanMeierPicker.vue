<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { type Coding } from '@dnpm-dip/core';
import { VCFormGroup, VCFormSelect } from '@vuecs/forms';
import { computed, defineComponent, ref } from 'vue';
import { injectHTTPClient } from '../../core/http-client';
import type { KaplanMeierOptions } from '../../domains';

export default defineComponent({
    components: { VCFormGroup, VCFormSelect },
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

        const transformCoding = (coding: Coding) => ({
            value: coding.code,
            label: coding.display ? `${coding.display}` : coding.code,
        });

        const typeOptions = computed(() => data.value.map((v) => transformCoding(v.key)));

        const groupingOptions = computed(() => {
            if (!type.value) {
                return [];
            }

            const entry = data.value.find((v) => v.key.code === type.value);
            if (!entry) {
                return [];
            }

            return entry.value.map((v) => transformCoding(v));
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
    <div class="flex flex-wrap -mx-2">
        <div class="flex-1 basis-0 px-2">
            <VCFormGroup>
                <template #label>
                    Type
                </template>
                <template #default>
                    <!-- update:model-value instead of change: the reworked
                         VCFormSelect no longer emits a (native) change event -->
                    <VCFormSelect
                        v-model="type"
                        :disabled="busy"
                        :options="typeOptions"
                        placeholder="..."
                        @update:model-value="handleTypeChanged"
                    />
                </template>
            </VCFormGroup>
        </div>
        <div class="flex-1 basis-0 px-2">
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
                        @update:model-value="handleGroupingChanged"
                    />
                </template>
            </VCFormGroup>
        </div>
    </div>
</template>
