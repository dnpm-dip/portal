<script lang="ts">
import {
    defineComponent, ref,
} from 'vue';
import {
    type Coding, useQueryFilterStore,
} from '@dnpm-dip/core';
import { QueryURLFilterKey } from '../../constants';
import { injectHTTPClient } from '../../core';
import type { QueryDiagnosisFilter } from '../../domains';

export default defineComponent({
    props: {
        queryId: {
            type: String,
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
        const httpClient = injectHTTPClient();

        const available = ref<QueryDiagnosisFilter>({});
        const availableInitialized = ref<boolean>(false);

        const load = async () => {
            try {
                available.value = await httpClient.query.getDiagnosisFilter(props.queryId);
            } catch (e) {
                available.value = {};
            } finally {
                availableInitialized.value = true;
            }
        };

        const category = ref<string[]>([]);

        const reset = () => {
            if (available.value.category) {
                category.value = available.value.category.map((el) => el.code);
                store.set(QueryURLFilterKey.DIAGNOSIS_CATEGORY, []);
            }
        };

        Promise.resolve()
            .then(() => load())
            .then(() => reset());

        const handleChanged = () => {
            if (!available.value.category) {
                return;
            }

            if (available.value.category.length === category.value.length) {
                store.set(QueryURLFilterKey.DIAGNOSIS_CATEGORY, []);
                return;
            }

            const data : Coding[] = [];
            for (let i = 0; i < category.value.length; i++) {
                const index = available.value.category.findIndex((el) => el.code === category.value[i]);
                if (index !== -1) {
                    data.push(available.value.category[index]);
                }
            }

            store.set(QueryURLFilterKey.DIAGNOSIS_CATEGORY, data);
        };

        const submit = () => {
            store.commit();

            emit('submit');
        };

        return {
            available,
            availableInitialized,

            category,

            handleChanged,

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
            v-if="available.category"
            class="mb-3"
        >
            <h6><i class="fas fa-tags" /> Kategorie</h6>

            <div>
                <template
                    v-for="item in available.category"
                    :key="item.code"
                >
                    <div class="form-check">
                        <VCFormInputCheckbox
                            v-model="category"
                            :label="true"
                            :label-content="(item.display || item.code)"
                            :value="item.code"
                            @change="handleChanged"
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
                    :disabled="!availableInitialized"
                    @click.prevent="submit"
                >
                    Anwenden
                </button>
            </div>
            <div>
                <button
                    :disabled="!availableInitialized"
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
