<script lang="ts">
import type { Ref } from 'vue';
import {
    computed, defineComponent, nextTick, ref,
} from 'vue';
import SearchForm from './SearchForm.vue';
import PreparedQueryList from './PreparedQueryList';
import PreparedQueryEntity from './PreparedQueryEntity';
import type { RDPreparedQuery, RDQueryCriteria, RDQuerySession } from '../../domains';

export default defineComponent({
    components: { PreparedQueryEntity, PreparedQueryList, SearchForm },
    emits: ['submitted'],
    setup(props, setup) {
        const searchEl = ref(null) as Ref<null | typeof SearchForm>;
        const preparedQuery = ref<RDPreparedQuery | undefined>(undefined);
        const criteria = ref<RDQueryCriteria | undefined>(undefined);

        const preparedQueryId = computed(() => {
            if (preparedQuery.value) {
                return preparedQuery.value.id;
            }

            return undefined;
        });

        const reset = () => {
            nextTick(() => {
                if (searchEl.value) {
                    searchEl.value.reset();
                }
            });
        };

        const togglePreparedQuery = (data: RDPreparedQuery) => {
            if (
                preparedQuery.value &&
                preparedQuery.value.id === data.id
            ) {
                preparedQuery.value = undefined;
                criteria.value = undefined;

                reset();
                return;
            }

            preparedQuery.value = data;
            criteria.value = data.criteria;
            reset();
        };

        const handleQueryCreated = (data: RDQuerySession) => {
            setup.emit('submitted', {
                queryId: data.id,
                criteria: data.criteria,
                ...(preparedQuery.value ? { preparedQueryId: preparedQueryId.value } : {}),
            });
        };

        const handleQueryUpdated = (data: RDQuerySession) => {
            setup.emit('submitted', {
                queryId: data.id,
                criteria: data.criteria,
                ...(preparedQuery.value ? { preparedQueryId: preparedQueryId.value } : {}),
            });
        };

        const handlePreparedQueryCreated = (data: RDPreparedQuery) => {
            preparedQuery.value = data;
        };

        const handlePreparedQueryDeleted = (data: RDPreparedQuery) => {
            if (
                preparedQuery.value &&
                preparedQuery.value.id === data.id
            ) {
                preparedQuery.value = undefined;
                criteria.value = undefined;

                reset();
            }
        };

        return {
            criteria,
            handleQueryCreated,
            handleQueryUpdated,
            handlePreparedQueryCreated,
            handlePreparedQueryDeleted,
            searchEl,
            togglePreparedQuery,
            preparedQuery,
            preparedQueryId,
        };
    },
});
</script>
<template>
    <div class="row">
        <div class="col-8">
            <SearchForm
                ref="searchEl"
                :criteria="criteria"
                :prepared-query="preparedQuery"
                @prepared-query-created="handlePreparedQueryCreated"
                @query-created="handleQueryCreated"
                @query-updated="handleQueryUpdated"
            />
        </div>
        <div class="col-4">
            <h6><i class="fa fa-history" /> Vordefinierte Anfragen</h6>
            <PreparedQueryList @deleted="handlePreparedQueryDeleted">
                <template #default="props">
                    <template v-if="props.data.length > 0">
                        <div class="list">
                            <ul class="list-body list-unstyled">
                                <template
                                    v-for="(item) in props.data"
                                    :key="item.id"
                                >
                                    <li class="list-item flex-row">
                                        <PreparedQueryEntity
                                            :entity="item"
                                            @deleted="props.deleted"
                                        >
                                            <template #default="entityProps">
                                                <div class="entity-card d-flex flex-row">
                                                    <div>
                                                        {{ entityProps.data.name || entityProps.data.id }}
                                                    </div>
                                                    <div class="ms-auto">
                                                        <button
                                                            type="button"
                                                            class="btn btn-xs me-1"
                                                            :class="{
                                                                'btn-primary': preparedQueryId !== entityProps.data.id,
                                                                'btn-secondary': preparedQueryId === entityProps.data.id
                                                            }"
                                                            @click.prevent="togglePreparedQuery(entityProps.data)"
                                                        >
                                                            <i
                                                                class="fa"
                                                                :class="{
                                                                    'fa-plus': preparedQueryId !== entityProps.data.id,
                                                                    'fa-minus': preparedQueryId === entityProps.data.id
                                                                }"
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            class="btn btn-xs btn-danger"
                                                            @click.prevent="entityProps.delete"
                                                        >
                                                            <i class="fa fa-trash" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </template>
                                        </PreparedQueryEntity>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </template>
                </template>
            </PreparedQueryList>
        </div>
    </div>
</template>
