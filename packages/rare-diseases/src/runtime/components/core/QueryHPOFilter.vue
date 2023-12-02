<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import type { HPOFilter, URLQueryRecord } from '@dnpm-dip/core';

export default defineComponent({
    props: {
        availableFilters: {
            type: Object as PropType<HPOFilter>,
            required: true,
        },
        busy: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['submit'],
    async setup(props, { emit }) {
        const term = ref<string[]>([]);
        const termChanged = ref(false);

        const hasChanged = computed(
            () => termChanged.value,
        );
        const isSubmitted = ref(true);

        const reset = () => {
            if (props.availableFilters.value) {
                term.value = props.availableFilters.value.map((el) => el.code);
            }

            termChanged.value = false;
            isSubmitted.value = false;
        };

        reset();

        watch(term, (value) => {
            if (!props.availableFilters.value) {
                return;
            }

            if (value.length !== props.availableFilters.value.length) {
                termChanged.value = true;
                isSubmitted.value = false;
                return;
            }

            let changed : boolean = false;
            let index : number;
            for (let i = 0; i < value.length; i++) {
                index = props.availableFilters.value.findIndex((el) => el.code === value[i]);
                if (index === -1) {
                    changed = true;
                    break;
                }
            }

            termChanged.value = changed;
            if (changed) {
                isSubmitted.value = false;
            }
        }, { deep: true });

        const submit = () => {
            if (props.busy) return;

            isSubmitted.value = true;

            const data : URLQueryRecord = {};

            if (term.value) {
                data.hpo = {
                    term: term.value,
                };
            } else {
                data.hpo = {};
            }

            emit('submit', data);
        };

        return {
            term,

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
                HPO
            </h5>
        </div>
        <div
            v-if="availableFilters.value"
            class="mb-3"
        >
            <h6><i class="fas fa-tags" /> Term</h6>

            <div>
                <template
                    v-for="item in availableFilters.value"
                    :key="item.code"
                >
                    <div class="form-check">
                        <VCFormInputCheckbox
                            v-model="term"
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
