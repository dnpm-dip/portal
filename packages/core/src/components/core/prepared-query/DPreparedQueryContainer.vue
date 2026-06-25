<script lang="ts">
import type { Component } from 'vue';
import {
    computed,
    defineComponent,
    ref,
} from 'vue';
import { VCButton } from '@vuecs/button';
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
        VCButton,
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
        const manageModal = ref<boolean>(false);

        const toggleModal = () => {
            modal.value = !modal.value;
        };

        const toggleManageModal = () => {
            manageModal.value = !manageModal.value;
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

            manageModal,
            toggleManageModal,

            setCriteria,
        };
    },
});

export default component as Component;
</script>
<template>
    <div class="flex flex-col gap-4">
        <DPreparedQueries
            ref="preparedQueryNode"
            :use-case="useCase"
            @deleted="handlePreparedQueryDeleted"
        >
            <template #default="props">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="section-label">
                        <VCIcon name="fa6-solid:clock-rotate-left" />
                        Gespeicherte Anfragen
                    </span>

                    <template v-if="!props.busy && props.data.length === 0">
                        <span class="text-sm text-fg-muted">
                            Es existieren keine gespeicherten Anfragen.
                        </span>
                    </template>

                    <template
                        v-for="(item) in props.data"
                        :key="item.id"
                    >
                        <button
                            type="button"
                            class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-colors"
                            :class="preparedQueryId === item.id ?
                                'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-200' :
                                'border-border bg-bg-muted text-fg hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-200'"
                            @click.prevent="togglePreparedQuery(item)"
                        >
                            <VCIcon :name="preparedQueryId === item.id ? 'fa6-solid:check' : 'fa6-solid:clock-rotate-left'" />
                            {{ item.name || item.id }}
                        </button>
                    </template>

                    <button
                        v-if="props.data.length > 0"
                        type="button"
                        class="ms-auto inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border
                               text-fg-muted transition-colors hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-200"
                        aria-label="Gespeicherte Anfragen verwalten"
                        @click.prevent="toggleManageModal"
                    >
                        <VCIcon name="fa6-solid:gear" />
                    </button>
                </div>

                <VCModal v-model:open="manageModal">
                    <VCModalContent>
                        <div class="flex items-center justify-between border-b border-border px-4 py-3">
                            <h6 class="mb-0">
                                <VCIcon name="fa6-solid:clock-rotate-left" />
                                Gespeicherte Anfragen
                            </h6>
                        </div>
                        <div class="px-4 py-3">
                            <ul class="flex list-none flex-col divide-y divide-border ps-0">
                                <template
                                    v-for="(item) in props.data"
                                    :key="item.id"
                                >
                                    <li class="flex items-center gap-3 py-2">
                                        <DPreparedQuery
                                            :use-case="useCase"
                                            :entity="item"
                                            @deleted="props.deleted"
                                        >
                                            <template #default="entityProps">
                                                <span class="min-w-0 truncate">
                                                    {{ entityProps.data.name || entityProps.data.id }}
                                                </span>
                                                <span class="ms-auto flex shrink-0 gap-1">
                                                    <VCButton
                                                        size="xs"
                                                        :color="preparedQueryId !== entityProps.data.id ? 'primary' : 'neutral'"
                                                        :variant="preparedQueryId !== entityProps.data.id ? undefined : 'soft'"
                                                        @click.prevent="togglePreparedQuery(entityProps.data)"
                                                    >
                                                        <VCIcon
                                                            :name="preparedQueryId !== entityProps.data.id ? 'fa6-solid:plus' : 'fa6-solid:minus'"
                                                        />
                                                    </VCButton>
                                                    <VCButton
                                                        size="xs"
                                                        color="error"
                                                        @click.prevent="() => entityProps.delete()"
                                                    >
                                                        <VCIcon name="fa6-solid:trash" />
                                                    </VCButton>
                                                </span>
                                            </template>
                                        </DPreparedQuery>
                                    </li>
                                </template>
                            </ul>
                            <template v-if="props.data.length === 0">
                                <p class="mb-0 text-sm text-fg-muted">
                                    Es existieren keine gespeicherten Anfragen.
                                </p>
                            </template>
                        </div>
                        <div class="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
                            <VCButton
                                size="xs"
                                color="neutral"
                                variant="soft"
                                @click.prevent="manageModal = false"
                            >
                                Schließen
                            </VCButton>
                        </div>
                    </VCModalContent>
                </VCModal>
            </template>
        </DPreparedQueries>

        <div>
            <!-- ref="searchEl" -->
            <slot
                :set-criteria="setCriteria"
                :criteria="criteria"
                :failed="handleFailed"
                :query-created="handleQueryCreated"
                :query-updated="handleQueryUpdated"
            />
        </div>

        <VCModal v-model:open="modal">
            <!-- the form inside holds in-progress input (the
                 pre-migration no-close-on-esc/backdrop guards) -->
            <VCModalContent close-policy="never">
                <div class="flex items-center justify-between border-b border-border px-4 py-3">
                    <h6 class="mb-0">
                        Vordefinierte Anfrage
                    </h6>
                </div>
                <div class="px-4 py-3">
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
                                    <VCButton
                                        :disabled="fProps.isBusy"
                                        size="xs"
                                        color="neutral"
                                        variant="soft"
                                        @click.prevent="modal = false"
                                    >
                                        Cancel
                                    </VCButton>
                                </div>
                                <div class="ms-auto">
                                    <VCButton
                                        size="xs"
                                        color="neutral"
                                        :disabled="fProps.isBusy || fProps.isInvalid"
                                        @click.prevent="fProps.submit"
                                    >
                                        Speichern
                                    </VCButton>
                                </div>
                            </div>
                        </template>
                    </DPreparedQueryForm>
                </div>
            </VCModalContent>
        </VCModal>
    </div>
</template>
