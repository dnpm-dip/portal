<script lang="ts">
import type { PropType, Ref } from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import { type DiagnosisFilter, clone } from '@dnpm-dip/core';

type QueryRecord = {
    diagnosis: {
        category: string[]
    }
};

export default defineComponent({
    props: {
        availableFilters: {
            type: Object as PropType<DiagnosisFilter>,
            required: true,
        },
        busy: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['submit'],
    async setup(props, { emit }) {
        const category = ref<string[]>([]);
        const categoryChanged = ref(false);

        const hasChanged = computed(
            () => categoryChanged.value,
        );

        const previousSelection = ref<string[] | null>(null);

        const reset = () => {
            if (props.availableFilters.category) {
                category.value = props.availableFilters.category.map((el) => el.code);
                previousSelection.value = clone(category.value);
            }

            categoryChanged.value = false;
        };

        reset();

        watch(category, (value) => {
            if (!previousSelection.value) {
                categoryChanged.value = true;
                return;
            }

            if (value.length !== previousSelection.value.length) {
                categoryChanged.value = true;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = previousSelection.value.findIndex((el) => el === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            categoryChanged.value = changed;
        }, { deep: true });

        const submit = () => {
            const data : QueryRecord = {
                diagnosis: {
                    category: clone(category.value),
                },
            };

            previousSelection.value = data.diagnosis?.category ?? [];

            if (
                props.availableFilters.category &&
                data.diagnosis.category.length === props.availableFilters.category.length
            ) {
                data.diagnosis.category = [];
            }

            emit('submit', data);

            categoryChanged.value = false;
        };

        return {
            category,

            hasChanged,

            reset,
            submit,
        };
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="text-center">
            <h5 class="text-muted">
                Diagnose
            </h5>
        </div>
        <div
            v-if="availableFilters.category"
            class="mb-3"
        >
            <h6><i class="fas fa-tags" /> Kategorie</h6>

            <div>
                <template
                    v-for="item in availableFilters.category"
                    :key="item.code"
                >
                    <div class="form-check">
                        <VCFormInputCheckbox
                            v-model="category"
                            :label="true"
                            :label-content="(item.display || item.code)"
                            :value="item.code"
                        />
                    </div>
                </template>
            </div>
        </div>

        <div class="row">
            <div class="form-group">
                <button
                    type="button"
                    class="btn btn-xs btn-primary btn-block"
                    :disabled="!hasChanged"
                    @click.prevent="submit"
                >
                    Anwenden
                </button>
            </div>
            <div>
                <button
                    type="button"
                    class="btn btn-xs btn-secondary btn-block"
                    @click.prevent="reset"
                >
                    Zurücksetzen
                </button>
            </div>
        </div>
    </div>
</template>
