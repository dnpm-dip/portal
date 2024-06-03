<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { useAbilityCheck } from '@authup/client-web-kit';
import { AdminPermissionName, DAdminConnectionReport, DConnectionPeerCard } from '@dnpm-dip/core';
import { defineNuxtComponent } from '#imports';

export default defineNuxtComponent({
    components: { DConnectionPeerCard, DAdminConnectionReport },
    setup() {
        const connectionReportRead = useAbilityCheck(AdminPermissionName.CONNECTION_REPORT_READ);

        return {
            connectionReportRead,
        };
    },
});
</script>
<template>
    <template v-if="connectionReportRead">
        <div>
            <h1 class="title no-border mb-3">
                <i class="fa fa-map-marker-alt" /> Standorte
            </h1>
        </div>
        <div class="d-flex flex-row gap-2">
            <DAdminConnectionReport>
                <template #default="{ data }">
                    <template
                        v-for="(item, key) in data.peers"
                        :key="key"
                    >
                        <DConnectionPeerCard :entity="item" />
                    </template>
                </template>
                <template #loading>
                    <DConnectionPeerCard />
                </template>
            </DAdminConnectionReport>
        </div>
    </template>
</template>
