<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import {
    type Coding, type DiagnosisFilter, useQueryFilterStore,
} from '@dnpm-dip/core';

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
        const store = useQueryFilterStore();
        const category = ref<string[]>([]);
        const categoryChanged = ref(false);

        const hasChanged = computed(
            () => categoryChanged.value,
        );

        const previousSelection = ref<string[] | null>(null);

        const reset = () => {
            if (props.availableFilters.category) {
                category.value = props.availableFilters.category.map((el) => el.code);
                previousSelection.value = [...category.value];
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
            const data : Coding[] = [];
            if (props.availableFilters.category) {
                for (let i = 0; i < category.value.length; i++) {
                    const index = props.availableFilters.category.findIndex((el) => el.code === category.value[i]);
                    if (index !== -1) {
                        data.push(props.availableFilters.category[index]);
                    }
                }
            }

            store.set('diagnosis[category]', data);
            store.commit();

            previousSelection.value = [...category.value];

            emit('submit');

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
