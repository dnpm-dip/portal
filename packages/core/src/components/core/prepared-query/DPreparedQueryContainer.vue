<script lang="ts">
import { BModal } from 'bootstrap-vue-next';
import type { Ref } from 'vue';
import {
    computed, defineComponent, ref,
} from 'vue';
import type { PreparedQuery } from '../../../domains';
import DPreparedQueries from './DPreparedQueries';
import DPreparedQuery from './DPreparedQuery';
import DPreparedQueryForm from './DPreparedQueryForm.vue';

export default defineComponent({
    components: {
        BModal,
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
    setup(props, { emit }) {
        const preparedQueryNode = ref(null) as Ref<null | typeof DPreparedQueries>;
        const preparedQuery = ref<PreparedQuery | undefined>(undefined);
        const preparedQueryId = computed(() => {
            if (preparedQuery.value) {
                return preparedQuery.value.id;
            }

            return undefined;
        });

        const criteria = ref<Record<string, any> | null>(null);
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

        const setCriteria = async (data: Record<string, any>) => {
            criteria.value = data;

            toggleModal();
        };

        const togglePreparedQuery = (data: PreparedQuery) => {
            if (
                preparedQuery.value &&
                preparedQuery.value.id === data.id
            ) {
                preparedQuery.value = undefined;
                criteria.value = null;
                return;
            }

            preparedQuery.value = data;
            criteria.value = data.criteria;
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
                criteria.value = null;
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

        <BModal
            v-model="modal"
            :size="'md'"
            :no-footer="true"
            :no-close-on-backdrop="true"
            :no-close-on-esc="true"
        >
            <template #header>
                <h6 class="mb-0">
                    Vordefinierte Anfrage
                </h6>
            </template>
            <template #default="props">
                <DPreparedQueryForm
                    :criteria="criteria"
                    :use-case="useCase"
                    :entity="preparedQuery"
                    @created="handleCreated"
                    @updated="handleUpdated"
                >
                    <template #default="fProps">
                        <div class="d-flex flex-row">
                            <div>
                                <button
                                    :disabled="fProps.isBusy"
                                    type="button"
                                    class="btn btn-secondary btn-xs"
                                    @click.prevent="props.cancel()"
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
            </template>
        </BModal>
    </div>
</template>
