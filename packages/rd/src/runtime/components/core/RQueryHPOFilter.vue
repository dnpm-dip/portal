<script lang="ts">
import {
    defineComponent, ref,
} from 'vue';
import { type Coding, DQueryFilterBox, useQueryFilterStore } from '@dnpm-dip/core';
import { QueryURLFilterKey } from '../../constants';
import { injectHTTPClient } from '../../core';
import type { QueryHpoFilter } from '../../domains';

export default defineComponent({
    components: { DQueryFilterBox },
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

        const available = ref<QueryHpoFilter>({});
        const availableInitialized = ref<boolean>(false);

        const load = async () => {
            try {
                available.value = await httpClient.query.getHpoFilter(props.queryId);
            } catch (e) {
                available.value = {};
            } finally {
                availableInitialized.value = true;
            }
        };

        const items = ref<string[]>([]);
        const reset = () => {
            if (available.value.value) {
                items.value = available.value.value.map((el) => el.code);
                store.setItems(QueryURLFilterKey.HPO_VALUE, []);
            }
        };

        Promise.resolve()
            .then(() => load())
            .then(() => reset());

        const handleChanged = () => {
            if (!available.value.value) {
                return;
            }

            if (available.value.value.length === items.value.length) {
                store.setItems(QueryURLFilterKey.HPO_VALUE, []);
                return;
            }

            const data : Coding[] = [];
            for (let i = 0; i < items.value.length; i++) {
                const index = available.value.value.findIndex((el) => el.code === items.value[i]);
                if (index !== -1) {
                    data.push(available.value.value[index]);
                }
            }

            store.setItems(QueryURLFilterKey.HPO_VALUE, data);
        };

        return {
            available,
            availableInitialized,

            items,

            handleChanged,

            reset,
        };
    },
});
</script>
<template>
    <DQueryFilterBox :name="'hpo'">
        <template #title>
            <i class="fa fa-dna" /> HPO
        </template>
        <template #default>
            <div
                v-if="available.value"
                class="mb-3"
            >
                <h6><i class="fas fa-tags" /> Term</h6>

                <div>
                    <template
                        v-for="item in available.value"
                        :key="item.code"
                    >
                        <div class="form-check">
                            <VCFormInputCheckbox
                                v-model="items"
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
