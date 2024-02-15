<script lang="ts">
import type { PropType, Ref } from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import { type HPOFilter, clone } from '@dnpm-dip/core';

type QueryRecord = {
    hpo: {
        term: string[]
    }
};

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

        const previousSelection = ref<string[] | null>(null);

        const reset = () => {
            if (props.availableFilters.value) {
                term.value = props.availableFilters.value.map((el) => el.code);
                previousSelection.value = clone(term.value);
            }

            termChanged.value = false;
        };

        reset();

        watch(term, (value) => {
            if (!previousSelection.value) {
                termChanged.value = true;
                return;
            }

            if (value.length !== previousSelection.value.length) {
                termChanged.value = true;
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

            termChanged.value = changed;
        }, { deep: true });

        const submit = () => {
            const data : QueryRecord = {
                hpo: {
                    term: clone(term.value),
                },
            };

            previousSelection.value = data.hpo?.term ?? [];

            if (
                props.availableFilters.value &&
                data.hpo.term.length === props.availableFilters.value.length
            ) {
                data.hpo.term = [];
            }

            emit('submit', data);

            termChanged.value = false;
        };

        return {
            term,

            hasChanged,
            termChanged,

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
                    :disabled="!hasChanged"
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
