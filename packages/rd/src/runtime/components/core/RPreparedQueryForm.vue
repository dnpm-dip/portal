<script lang="ts">
import type { Ref } from 'vue';
import {
    computed, defineComponent, nextTick, ref,
} from 'vue';
import SearchForm from './RSearchForm.vue';
import RPreparedQueries from './RPreparedQueries';
import RPreparedQuery from './RPreparedQuery';
import type { PreparedQuery, QueryCriteria, QuerySession } from '../../domains';

export default defineComponent({
    components: { RPreparedQuery, RPreparedQueries, SearchForm },
    emits: ['submitted', 'failed'],
    setup(props, setup) {
        const searchEl = ref(null) as Ref<null | typeof SearchForm>;
        const criteria = ref<QueryCriteria | undefined>(undefined);

        const preparedQueryNode = ref(null) as Ref<null | typeof RPreparedQueries>;
        const preparedQuery = ref<PreparedQuery | undefined>(undefined);
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

        const togglePreparedQuery = (data: PreparedQuery) => {
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

        const handleFailed = (e: Error) => {
            setup.emit('failed', e);
        };

        const handleQueryCreated = (data: QuerySession) => {
            setup.emit('submitted', {
                queryId: data.id,
                criteria: data.criteria,
                ...(preparedQuery.value ? { preparedQueryId: preparedQueryId.value } : {}),
            });
        };

        const handleQueryUpdated = (data: QuerySession) => {
            setup.emit('submitted', {
                queryId: data.id,
                criteria: data.criteria,
                ...(preparedQuery.value ? { preparedQueryId: preparedQueryId.value } : {}),
            });
        };

        const handlePreparedQueryCreated = (data: PreparedQuery) => {
            preparedQuery.value = data;
            if (preparedQueryNode.value) {
                preparedQueryNode.value.created(data);
            }
        };

        const handlePreparedQueryUpdated = (data: PreparedQuery) => {
            preparedQuery.value = data;
            if (preparedQueryNode.value) {
                preparedQueryNode.value.updated(data);
            }
        };

        const handlePreparedQueryDeleted = (data: PreparedQuery) => {
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
            handleFailed,
            handleQueryCreated,
            handleQueryUpdated,
            handlePreparedQueryCreated,
            handlePreparedQueryUpdated,
            handlePreparedQueryDeleted,
            searchEl,
            togglePreparedQuery,
            preparedQuery,
            preparedQueryId,
            preparedQueryNode,
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
                @failed="handleFailed"
                @prepared-query-created="handlePreparedQueryCreated"
                @prepared-query-updated="handlePreparedQueryUpdated"
                @query-created="handleQueryCreated"
                @query-updated="handleQueryUpdated"
            />
        </div>
        <div class="col-4">
            <h6><i class="fa fa-history" /> Vordefinierte Anfragen</h6>
            <RPreparedQueries
                ref="preparedQueryNode"
                @deleted="handlePreparedQueryDeleted"
            >
                <template #default="props">
                    <template
                        v-if="!props.busy && props.data.length === 0"
                    >
                        <div class="alert alert-sm alert-secondary">
                            Es existieren keine vordefinierten Anfragen.
                        </div>
                    </template>
                    <template v-if="!props.busy && props.data.length > 0">
                        <div class="list">
                            <ul class="list-body list-unstyled">
                                <template
                                    v-for="(item) in props.data"
                                    :key="item.id"
                                >
                                    <li class="list-item flex-row">
                                        <RPreparedQuery
                                            :entity="item"
                                            @deleted="props.deleted"
                                        >
                                            <template #default="entityProps">
                                                <div class="entity-card d-flex flex-row w-100">
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
                                        </RPreparedQuery>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </template>
                </template>
            </RPreparedQueries>
        </div>
    </div>
</template>
