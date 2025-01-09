<script lang="ts">
import type { Ref } from 'vue';
import {
    computed, defineComponent, ref,
} from 'vue';
import { injectHTTPClient } from '../../../core';
import type { PreparedQuery } from '../../../domains';
import { PreparedQueryAPI } from '../../../domains';
import DPreparedQueries from './DPreparedQueries';
import DPreparedQuery from './DPreparedQuery';

export default defineComponent({
    components: {
        DPreparedQuery,
        DPreparedQueries,
    },
    props: {
        useCase: {
            type: String,
            required: true,
        },
    },
    emits: ['submitted', 'failed'],
    setup(props, { emit }) {
        const httpClient = injectHTTPClient();
        const preparedQueryAPI = new PreparedQueryAPI({ client: httpClient, useCase: props.useCase });

        const preparedQueryNode = ref(null) as Ref<null | typeof DPreparedQueries>;
        const preparedQuery = ref<PreparedQuery | undefined>(undefined);
        const preparedQueryId = computed(() => {
            if (preparedQuery.value) {
                return preparedQuery.value.id;
            }

            return undefined;
        });

        const criteria = computed(() => {
            if (preparedQuery.value) {
                return preparedQuery.value.criteria;
            }

            return null;
        });

        const busy = ref<boolean>(false);

        const reset = () => {

        };

        const save = async (data: Record<string, any>) => {
            if (busy.value) return;

            busy.value = true;

            try {
                if (preparedQueryId.value) {
                    preparedQuery.value = await preparedQueryAPI.update(
                        preparedQueryId.value,
                        {
                            criteria: data,
                        },
                    );
                    if (preparedQueryNode.value) {
                        preparedQueryNode.value?.updated(preparedQuery.value);
                    }
                } else {
                    preparedQuery.value = await preparedQueryAPI.create({
                        criteria: data,
                    });

                    if (preparedQueryNode.value) {
                        preparedQueryNode.value?.created(preparedQuery.value);
                    }
                }
            } catch (e) {
                if (e instanceof Error) {
                    emit('failed', e);
                }
            } finally {
                busy.value = false;
            }
        };

        const togglePreparedQuery = (data: PreparedQuery) => {
            if (
                preparedQuery.value &&
                preparedQuery.value.id === data.id
            ) {
                preparedQuery.value = undefined;

                reset();
                return;
            }

            preparedQuery.value = data;
            reset();
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const handleQueryCreated = (data: Record<string, any>) => {
            emit('submitted', {
                ...data,
                ...(preparedQuery.value ? { preparedQueryId: preparedQueryId.value } : {}),
            });
        };

        const handleQueryUpdated = (data: Record<string, any>) => {
            emit('submitted', {
                ...data,
                ...(preparedQuery.value ? { preparedQueryId: preparedQueryId.value } : {}),
            });
        };

        const handlePreparedQueryDeleted = (data: PreparedQuery) => {
            if (
                preparedQuery.value &&
                preparedQuery.value.id === data.id
            ) {
                preparedQuery.value = undefined;

                reset();
            }
        };

        return {
            criteria,
            handleFailed,
            handleQueryCreated,
            handleQueryUpdated,
            handlePreparedQueryDeleted,
            togglePreparedQuery,
            preparedQuery,
            preparedQueryId,
            preparedQueryNode,

            save,
        };
    },
});
</script>
<template>
    <div class="row">
        <div class="col-8">
            <!-- ref="searchEl" -->
            <slot
                :save="save"
                :criteria="criteria"
                :failed="handleFailed"
                :query-created="handleQueryCreated"
                :query-updated="handleQueryUpdated"
            />
        </div>
        <div class="col-4">
            <h6><i class="fa fa-history" /> Gespeicherte Anfragen</h6>
            <DPreparedQueries
                ref="preparedQueryNode"
                :use-case="useCase"
                @deleted="handlePreparedQueryDeleted"
            >
                <template #default="props">
                    <template
                        v-if="!props.busy && props.data.length === 0"
                    >
                        <div class="alert alert-sm alert-secondary">
                            Es existieren keine gespeicherten Anfragen.
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
                                        <DPreparedQuery
                                            :use-case="useCase"
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
                                        </DPreparedQuery>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </template>
                </template>
            </DPreparedQueries>
        </div>
    </div>
</template>
