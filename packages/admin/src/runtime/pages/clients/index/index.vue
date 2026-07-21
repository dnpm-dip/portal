<script lang="ts">

import type { TableColumn } from '@vuecs/table';
import type { Client } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import {
    AClients,
    AEntityDelete,
    APagination,
    ASearch,
    ATitle,
    injectStore,
    storeToRefs,
    usePermissionCheck,
} from '@authup/client-web-kit';
import type { BuildInput } from 'rapiq';
import { VCButton } from '@vuecs/button';
import { VCIcon } from '@vuecs/icon';
import { VCTimeago } from '@vuecs/timeago';
import { resolveComponent } from 'vue';
import { defineNuxtComponent } from '#imports';

export default defineNuxtComponent({
    components: {
        ATitle,
        APagination,
        ASearch,
        AClients,
        AEntityDelete,
        VCButton,
        VCIcon,
        VCTimeago,
    },
    emits: ['deleted'],
    setup(props, { emit }) {
        const NuxtLink = resolveComponent('NuxtLink');

        const handleDeleted = (e: Client) => {
            emit('deleted', e);
        };

        const store = injectStore();
        const { realmManagementId } = storeToRefs(store);

        const query : BuildInput<Client> = { filter: { realm_id: [realmManagementId.value, null] } };

        const hasEditPermission = usePermissionCheck({ name: PermissionName.CLIENT_UPDATE });
        const hasDropPermission = usePermissionCheck({ name: PermissionName.CLIENT_DELETE });

        const columns: TableColumn[] = [
            {
                key: 'name',
                label: 'Name',
                headerClass: 'text-left',
                cellClass: 'text-left',
            },
            {
                key: 'active',
                label: 'Aktiv',
                headerClass: 'text-center',
                cellClass: 'text-center',
            },
            {
                key: 'is_confidential',
                label: 'Vertraulich',
                headerClass: 'text-center',
                cellClass: 'text-center',
            },
            {
                key: 'built_in',
                label: 'Integriert',
                headerClass: 'text-center',
                cellClass: 'text-center',
            },
            {
                key: 'created_at',
                label: 'Erstelldatum',
                headerClass: 'text-center',
                cellClass: 'text-center',
            },
            {
                key: 'updated_at',
                label: 'Aktualisierungsdatum',
                headerClass: 'text-center',
                cellClass: 'text-center',
            },
            {
                key: 'options',
                label: '',
                cellClass: 'text-left',
            },
        ];

        return {
            NuxtLink,
            columns,
            hasEditPermission,
            hasDropPermission,
            handleDeleted,
            query,
        };
    },
});
</script>
<template>
    <AClients
        :query="query"
        @deleted="handleDeleted"
    >
        <template #header="props">
            <ATitle />
            <ASearch
                :load="props.load"
                :busy="props.busy"
            />
        </template>
        <template #footer="props">
            <APagination
                :busy="props.busy"
                :meta="props.meta"
                :load="props.load"
            />
        </template>
        <template #body="props">
            <VCTable
                :data="props.data"
                :columns="columns"
                :busy="props.busy"
            >
                <template #cell-name="{ row }: { row: any }">
                    <template v-if="row.display_name">
                        {{ row.display_name }} <span class="text-fg-muted">({{ row.name }})</span>
                    </template>
                    <template v-else>
                        {{ row.name }}
                    </template>
                </template>
                <template #cell-active="{ row }: { row: any }">
                    <VCIcon
                        :name="row.active ? 'fa6-solid:check' : 'fa6-solid:xmark'"
                        :class="row.active ? 'text-success-600' : 'text-error-600'"
                    />
                </template>
                <template #cell-is_confidential="{ row }: { row: any }">
                    <VCIcon
                        :name="row.is_confidential ? 'fa6-solid:check' : 'fa6-solid:xmark'"
                        :class="row.is_confidential ? 'text-success-600' : 'text-error-600'"
                    />
                </template>
                <template #cell-built_in="{ row }: { row: any }">
                    <VCIcon
                        :name="row.built_in ? 'fa6-solid:check' : 'fa6-solid:xmark'"
                        :class="row.built_in ? 'text-success-600' : 'text-error-600'"
                    />
                </template>
                <template #cell-created_at="{ row }: { row: any }">
                    <VCTimeago :datetime="row.created_at" />
                </template>
                <template #cell-updated_at="{ row }: { row: any }">
                    <VCTimeago :datetime="row.updated_at" />
                </template>
                <template #cell-options="{ row }: { row: any }">
                    <div class="flex items-center gap-1">
                        <VCButton
                            v-if="hasEditPermission"
                            :as="NuxtLink"
                            :to="'/admin/clients/'+ row.id"
                            size="xs"
                            color="primary"
                            variant="outline"
                        >
                            <VCIcon name="fa6-solid:bars" />
                        </VCButton>
                        <AEntityDelete
                            size="sm"
                            :entity-id="row.id"
                            entity-type="client"
                            :with-text="false"
                            :disabled="!hasDropPermission"
                            @deleted="props.deleted"
                        />
                    </div>
                </template>
                <VCTableLoading />
                <VCTableEmpty />
            </VCTable>
        </template>
    </AClients>
</template>
