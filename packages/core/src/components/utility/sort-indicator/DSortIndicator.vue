<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { type PropType, computed, defineComponent } from 'vue';
import type { SortDescriptor, TableColumn } from '@vuecs/table';
import { VCButton } from '@vuecs/button';
import { VCBadge } from '@vuecs/elements';
import { VCIcon } from '@vuecs/icon';
import { isObject } from 'smob';

export default defineComponent({
    components: {
        VCButton, 
        VCBadge, 
        VCIcon, 
    },
    props: {
        sortBy: {
            type: Array as PropType<SortDescriptor[]>,
            default: () => [],
        },
        fields: {
            type: Array as PropType<TableColumn[]>,
            default: () => [],
        },
        labelMap: {
            type: Object as PropType<Record<string, string>>,
            default: () => ({}),
        },
    },
    emits: ['reset'],
    setup(props, { emit }) {
        const activeSorts = computed(() => props.sortBy
            .filter((s) => s.direction)
            .map((s) => {
                let label: string | undefined = props.labelMap[s.key];

                if (!label) {
                    const field = props.fields.find(
                        (f) => isObject(f) && f.key === s.key,
                    );
                    label = field && isObject(field) && typeof field.label === 'string' ?
                        field.label :
                        s.key;
                }

                return {
                    key: s.key,
                    label,
                    order: s.direction,
                };
            }));

        const hasActiveSorts = computed(() => activeSorts.value.length > 0);

        const reset = () => {
            emit('reset');
        };

        return {
            activeSorts,
            hasActiveSorts,
            reset,
        };
    },
});
</script>
<template>
    <div
        v-if="hasActiveSorts"
        class="d-sort-indicator flex items-center gap-2 mb-2 p-2 bg-bg-elevated border rounded"
    >
        <small class="text-fg-muted font-bold">Sortierung:</small>
        <VCBadge
            v-for="(sort, index) in activeSorts"
            :key="sort.key"
            class="bg-bg-muted flex items-center gap-1"
        >
            {{ sort.label }}
            <VCIcon
                class="text-sm"
                :name="sort.order === 'asc' ? 'fa6-solid:arrow-up' : 'fa6-solid:arrow-down'"
            />
            <span
                v-if="index < activeSorts.length - 1"
                class="text-fg-muted"
            />
        </VCBadge>
        <VCButton
            type="button"
            size="sm"
            color="neutral"
            variant="outline"
            class="ms-auto"
            @click="reset"
        >
            <VCIcon
                name="fa6-solid:xmark"
                class="me-1"
            />
            Zurücksetzen
        </VCButton>
    </div>
</template>
