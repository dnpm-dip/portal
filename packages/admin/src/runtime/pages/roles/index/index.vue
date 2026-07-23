<script lang="ts">

import type { TableColumn } from '@vuecs/table';
import type { Role } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import {
    AEntityDelete,
    APagination,
    ARoles,
    ASearch,
    ATitle,
    injectStore,
    storeToRefs,
    usePermissionCheck,
} from '@authup/client-web-kit';
import type { EntityListQueryInput } from '@authup/client-web-kit';
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
        ARoles,
        AEntityDelete,
        VCButton,
        VCIcon,
        VCTimeago,
    },
    emits: ['deleted'],
    setup(props, { emit }) {
        const NuxtLink = resolveComponent('NuxtLink');

        const handleDeleted = (e: Role) => {
            emit('deleted', e);
        };

        const store = injectStore();
        const { realmManagementId } = storeToRefs(store);

        const query : EntityListQueryInput<Role> = { filters: { realmId: [realmManagementId.value, null] } };

        const hasEditPermission = usePermissionCheck({ name: PermissionName.ROLE_UPDATE });
        const hasDropPermission = usePermissionCheck({ name: PermissionName.ROLE_DELETE });

        const columns: TableColumn[] = [
            {
                key: 'name',
                label: 'Name',
                headerClass: 'text-left',
                cellClass: 'text-left',
            },
            {
                key: 'createdAt',
                label: 'Erstelldatum',
                headerClass: 'text-center',
                cellClass: 'text-center',
            },
            {
                key: 'updatedAt',
                label: 'Aktualisierungsdatum',
                headerClass: 'text-left',
                cellClass: 'text-left',
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
    <ARoles
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
                    <template v-if="row.displayName">
                        {{ row.displayName }} <span class="text-fg-muted">({{ row.name }})</span>
                    </template>
                    <template v-else>
                        {{ row.name }}
                    </template>
                </template>
                <template #cell-createdAt="{ row }: { row: any }">
                    <VCTimeago :datetime="row.createdAt" />
                </template>
                <template #cell-updatedAt="{ row }: { row: any }">
                    <VCTimeago :datetime="row.updatedAt" />
                </template>
                <template #cell-options="{ row }: { row: any }">
                    <div class="flex items-center gap-1">
                        <VCButton
                            v-if="hasEditPermission"
                            :as="NuxtLink"
                            :to="'/admin/roles/'+ row.id"
                            size="xs"
                            color="primary"
                            variant="outline"
                        >
                            <VCIcon name="fa6-solid:bars" />
                        </VCButton>
                        <AEntityDelete
                            size="sm"
                            :entity-id="row.id"
                            entity-type="role"
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
    </ARoles>
</template>
