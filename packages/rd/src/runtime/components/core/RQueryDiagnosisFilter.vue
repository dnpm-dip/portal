<script lang="ts">
import {
    defineComponent, ref,
} from 'vue';
import {
    type Coding, DQueryFilterBox, useQueryFilterStore,
} from '@dnpm-dip/core';
import { QueryURLFilterKey } from '../../constants';
import { injectHTTPClient } from '../../core';
import type { QueryDiagnosisFilter } from '../../domains';

export default defineComponent({
    components: {
        DQueryFilterBox,
    },
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
                store.setItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY, []);
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
                store.setItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY, []);
                return;
            }

            const data : Coding[] = [];
            for (let i = 0; i < category.value.length; i++) {
                const index = available.value.category.findIndex((el) => el.code === category.value[i]);
                if (index !== -1) {
                    data.push(available.value.category[index]);
                }
            }

            store.setItems(QueryURLFilterKey.DIAGNOSIS_CATEGORY, data);
        };

        return {
            available,
            availableInitialized,

            category,

            handleChanged,

            reset,
        };
    },
});
</script>
<template>
    <DQueryFilterBox :name="'diagnosis'">
        <template #title>
            <i class="fa fa-stethoscope" /> Diagnose
        </template>
        <template #default>
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
        </template>
    </DQueryFilterBox>
</template>
