<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import type { DiagnosisFilter, URLQueryRecord } from '@dnpm-dip/core';

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
        const isSubmitted = ref(true);

        const reset = () => {
            if (props.availableFilters.category) {
                category.value = props.availableFilters.category.map((el) => el.code);
            }

            categoryChanged.value = false;
            isSubmitted.value = false;
        };

        reset();

        watch(category, (value) => {
            if (!props.availableFilters.category) {
                return;
            }

            if (value.length !== props.availableFilters.category.length) {
                categoryChanged.value = true;
                isSubmitted.value = false;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = props.availableFilters.category.findIndex((el) => el.code === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            categoryChanged.value = changed;
            if (changed) {
                isSubmitted.value = false;
            }
        }, { deep: true });

        const submit = () => {
            if (props.busy) return;

            isSubmitted.value = true;

            const data : URLQueryRecord = {};

            if (category.value) {
                data.diagnosis = {
                    category: category.value,
                };
            } else {
                data.diagnosis = [];
            }

            emit('submit', data);
        };

        return {
            category,

            hasChanged,
            isSubmitted,

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
                    :disabled="isSubmitted || busy"
                    @click.prevent="submit"
                >
                    Anwenden
                </button>
            </div>
            <div v-if="hasChanged">
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
