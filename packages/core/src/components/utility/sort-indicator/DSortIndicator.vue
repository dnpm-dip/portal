<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { type PropType, computed, defineComponent } from 'vue';
import type { BTableSortBy, TableFieldRaw } from 'bootstrap-vue-next';
import { isObject } from 'smob';

export default defineComponent({
    props: {
        sortBy: {
            type: Array as PropType<BTableSortBy[]>,
            default: () => [],
        },
        fields: {
            type: Array as PropType<TableFieldRaw[]>,
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
            .filter((s) => s.order)
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
                    order: s.order,
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
        class="d-sort-indicator d-flex align-items-center gap-2 mb-2 p-2 bg-light border rounded"
    >
        <small class="text-muted fw-bold">Sortierung:</small>
        <span
            v-for="(sort, index) in activeSorts"
            :key="sort.key"
            class="badge bg-secondary d-flex align-items-center gap-1"
        >
            {{ sort.label }}
            <i
                class="fa fa-sm"
                :class="sort.order === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'"
            />
            <span
                v-if="index < activeSorts.length - 1"
                class="text-muted"
            />
        </span>
        <button
            type="button"
            class="btn btn-sm btn-outline-secondary ms-auto"
            @click="reset"
        >
            <i class="fa fa-times me-1" />
            Zurücksetzen
        </button>
    </div>
</template>
