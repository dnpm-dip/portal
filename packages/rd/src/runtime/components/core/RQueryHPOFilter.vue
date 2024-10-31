<script lang="ts">
import {
    defineComponent, ref,
} from 'vue';
import { type Coding, useQueryFilterStore } from '@dnpm-dip/core';
import { QueryURLFilterKey } from '../../constants';
import { injectHTTPClient } from '../../core';
import type { QueryHpoFilter } from '../../domains';

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
                store.set(QueryURLFilterKey.HPO_VALUE, []);
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
                store.set(QueryURLFilterKey.HPO_VALUE, []);
                return;
            }

            const data : Coding[] = [];
            for (let i = 0; i < items.value.length; i++) {
                const index = available.value.value.findIndex((el) => el.code === items.value[i]);
                if (index !== -1) {
                    data.push(available.value.value[index]);
                }
            }

            store.set(QueryURLFilterKey.HPO_VALUE, data);
        };

        const submit = () => {
            store.commit();

            emit('submit');
        };

        return {
            available,
            availableInitialized,

            items,

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
                HPO
            </h5>
        </div>
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
