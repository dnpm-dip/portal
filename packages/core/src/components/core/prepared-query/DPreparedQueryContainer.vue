<script lang="ts">
import type { Component } from 'vue';
import {
    computed,
    defineComponent,
    ref,
} from 'vue';
import type { PreparedQuery } from '../../../domains';
import DPreparedQueries from './DPreparedQueries';
import DPreparedQuery from './DPreparedQuery';
import DPreparedQueryForm from './DPreparedQueryForm.vue';

type PreparedQueriesInstance = {
    created: (data: PreparedQuery) => void;
    updated: (data: PreparedQuery) => void;
};

const component = defineComponent({
    components: {
        DPreparedQueryForm,
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
    setup(_props, { emit }) {
        const preparedQueryNode = ref<PreparedQueriesInstance | null>(null);
        const preparedQuery = ref<PreparedQuery | undefined>(undefined);
        const preparedQueryId = computed(() => {
            if (preparedQuery.value) {
                return preparedQuery.value.id;
            }

            return undefined;
        });

        const criteria = ref<Record<string, unknown> | undefined>(undefined);
        const modal = ref<boolean>(false);

        const toggleModal = () => {
            modal.value = !modal.value;
        };

        const handleCreated = (data: PreparedQuery) => {
            preparedQuery.value = data;
            criteria.value = data.criteria;

            modal.value = false;

            if (
                preparedQueryNode.value &&
                typeof preparedQueryNode.value.created === 'function'
            ) {
                preparedQueryNode.value.created(data);
            }
        };

        const handleUpdated = (data: PreparedQuery) => {
            preparedQuery.value = data;
            criteria.value = data.criteria;

            modal.value = false;

            if (
                preparedQueryNode.value &&
                typeof preparedQueryNode.value.updated === 'function'
            ) {
                preparedQueryNode.value.updated(data);
            }
        };

        const setCriteria = async (data: Record<string, unknown>) => {
            criteria.value = data;

            toggleModal();
        };

        const togglePreparedQuery = (data: PreparedQuery) => {
            if (
                preparedQuery.value &&
                preparedQuery.value.id === data.id
            ) {
                preparedQuery.value = undefined;
                criteria.value = undefined;
                return;
            }

            preparedQuery.value = data;
            criteria.value = data.criteria;
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const handleQueryCreated = (data: Record<string, unknown>) => {
            emit('submitted', {
                ...data,
                ...(preparedQuery.value ? { preparedQueryId: preparedQueryId.value } : {}),
            });
        };

        const handleQueryUpdated = (data: Record<string, unknown>) => {
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
                criteria.value = undefined;
            }
        };

        return {
            criteria,

            handleCreated,
            handleUpdated,

            handleFailed,
            handleQueryCreated,
            handleQueryUpdated,
            handlePreparedQueryDeleted,
            togglePreparedQuery,
            preparedQuery,
            preparedQueryId,
            preparedQueryNode,

            modal,
            toggleModal,

            setCriteria,
        };
    },
});

export default component as Component;
</script>
<template>
    <div class="row">
        <div class="col-8">
            <!-- ref="searchEl" -->
            <slot
                :set-criteria="setCriteria"
                :criteria="criteria"
                :failed="handleFailed"
                :query-created="handleQueryCreated"
                :query-updated="handleQueryUpdated"
            />
        </div>
        <div class="col-4">
            <h6><VCIcon name="fa6-solid:clock-rotate-left" /> Gespeicherte Anfragen</h6>
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
                                                <div class="entity-card flex flex-row w-full">
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
                                                            <VCIcon
                                                                :name="preparedQueryId !== entityProps.data.id ? 'fa6-solid:plus' : 'fa6-solid:minus'"
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            class="btn btn-xs btn-danger"
                                                            @click.prevent="() => entityProps.delete()"
                                                        >
                                                            <VCIcon name="fa6-solid:trash" />
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

        <VCModal v-model:open="modal">
            <VCModalContent>
                <div class="modal-header">
                    <h6 class="mb-0">
                        Vordefinierte Anfrage
                    </h6>
                </div>
                <div class="modal-body">
                    <DPreparedQueryForm
                        :criteria="criteria"
                        :use-case="useCase"
                        :entity="preparedQuery"
                        @created="handleCreated"
                        @updated="handleUpdated"
                    >
                        <template #default="fProps">
                            <div class="flex flex-row">
                                <div>
                                    <button
                                        :disabled="fProps.isBusy"
                                        type="button"
                                        class="btn btn-secondary btn-xs"
                                        @click.prevent="modal = false"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div class="ms-auto">
                                    <button
                                        type="button"
                                        class="btn btn-xs btn-dark"
                                        :disabled="fProps.isBusy || fProps.isInvalid"
                                        @click.prevent="fProps.submit"
                                    >
                                        Speichern
                                    </button>
                                </div>
                            </div>
                        </template>
                    </DPreparedQueryForm>
                </div>
            </VCModalContent>
        </VCModal>
    </div>
</template>
