<script lang="ts">
import {
    computed,
    defineComponent,
    ref,
} from 'vue';
import {
    type Coding,
    DQueryFilterBox,
    isCoding,
    useQueryFilterStore,
} from '@dnpm-dip/core';
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
    async setup(props) {
        const store = useQueryFilterStore();
        const httpClient = injectHTTPClient();

        const available = ref<QueryHpoFilter>({});
        const availableInitialized = ref<boolean>(false);

        const load = async () => {
            try {
                available.value = await httpClient.query.getHpoFilter(props.queryId);
            } catch {
                available.value = {};
            } finally {
                availableInitialized.value = true;
            }
        };

        const items = ref<string[]>([]);
        const reset = () => {
            if (available.value.value) {
                items.value = available.value.value.map((el) => el.code);
            }
            store.setItems(QueryURLFilterKey.HPO_VALUE, []);
        };

        const init = () => {
            const availableCodes = (available.value.value || []).map((el) => el.code);
            const storeItems = store.getItems(QueryURLFilterKey.HPO_VALUE)
                .filter((el) => isCoding(el))
                .map((el) => el.code)
                .filter((code) => availableCodes.includes(code));

            if (storeItems.length === 0) {
                items.value = availableCodes;
                return;
            }

            items.value = storeItems;
        };

        Promise.resolve()
            .then(() => load())
            .then(() => init());

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
                const found = index !== -1 ? available.value.value[index] : undefined;
                if (found) {
                    data.push(found);
                }
            }

            store.setItems(QueryURLFilterKey.HPO_VALUE, data);
        };

        const active = computed(() => store.getItems(QueryURLFilterKey.HPO_VALUE).length > 0);

        return {
            available,
            availableInitialized,

            items,

            active,

            handleChanged,

            reset,
        };
    },
});
</script>
<template>
    <DQueryFilterBox
        :name="'hpo'"
        :active="active"
        @reset="reset"
    >
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
        </template>
    </DQueryFilterBox>
</template>
