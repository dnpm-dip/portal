<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { usePermissionCheck } from '@authup/client-web-kit';
import { DConnectionPeerCard } from '@dnpm-dip/core';
import { VCAlert } from '@vuecs/elements';
import { defineNuxtComponent } from '#imports';
import AConnectionReport from '../components/AConnectionReport';
import { PermissionName } from '../domains';

export default defineNuxtComponent({
    components: {
        AConnectionReport, 
        DConnectionPeerCard, 
        VCAlert, 
    },
    setup() {
        const connectionReportRead = usePermissionCheck({ name: PermissionName.CONNECTION_REPORT_READ });

        return { connectionReportRead };
    },
});
</script>
<template>
    <template v-if="connectionReportRead">
        <header class="mb-4 flex items-center gap-4">
            <span
                class="flex size-12 shrink-0 items-center justify-center rounded-xl
                       bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary shadow-md"
            >
                <VCIcon name="fa6-solid:plug" />
            </span>
            <div class="min-w-0">
                <h1 class="mb-0 text-2xl font-bold tracking-tight">
                    Verbindungen
                </h1>
                <p class="mb-0 text-sm text-fg-muted">
                    Übersicht der Standort-Verbindungen
                </p>
            </div>
        </header>
        <AConnectionReport>
            <template #default="{ data }">
                <div class="flex flex-col gap-3">
                    <div>
                        <h5 class="section-label mb-2">
                            <VCIcon name="fa6-solid:location-dot" />
                            Mein Standort
                        </h5>
                        <div class="flex flex-row flex-wrap gap-2">
                            <DConnectionPeerCard :entity="data.self" />
                        </div>
                    </div>

                    <div>
                        <h5 class="section-label mb-2">
                            <VCIcon name="fa6-solid:location-dot" />
                            Externe Standorte
                        </h5>
                        <div class="flex flex-row flex-wrap gap-2">
                            <template
                                v-for="(item, key) in data.peers"
                                :key="key"
                            >
                                <DConnectionPeerCard :entity="item" />
                            </template>
                        </div>

                        <template v-if="data.peers.length === 0">
                            <VCAlert
                                color="info"
                                variant="soft"
                                size="sm"
                            >
                                Es sind keine externen Standorte erreichbar.
                            </VCAlert>
                        </template>
                    </div>
                </div>
            </template>
            <template #loading>
                <DConnectionPeerCard />
            </template>
        </AConnectionReport>
    </template>
</template>
