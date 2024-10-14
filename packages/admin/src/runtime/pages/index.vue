<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { usePermissionCheck } from '@authup/client-web-kit';
import { DConnectionPeerCard } from '@dnpm-dip/core';
import { defineNuxtComponent } from '#imports';
import AConnectionReport from '../components/AConnectionReport';
import { PermissionName } from '../domains';

export default defineNuxtComponent({
    components: { AConnectionReport, DConnectionPeerCard },
    setup() {
        const connectionReportRead = usePermissionCheck({ name: PermissionName.CONNECTION_REPORT_READ });

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
            <AConnectionReport>
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
            </AConnectionReport>
        </div>
    </template>
</template>
