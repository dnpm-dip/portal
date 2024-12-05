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
                <i class="fa fa-plug" /> Verbindungen
                <span class="sub-title">
                    Übersicht
                </span>
            </h1>
        </div>
        <AConnectionReport>
            <template #default="{ data }">
                <div class="d-flex flex-column gap-3">
                    <div>
                        <h5 class="title no-border">
                            <i class="fa fa-map-marker-alt" /> Mein Standort
                        </h5>
                        <div class="d-flex flex-row flex-wrap gap-2">
                            <DConnectionPeerCard :entity="data.self" />
                        </div>
                    </div>

                    <div>
                        <h5 class="title no-border">
                            <i class="fa fa-map-marker-alt" /> Externe Standorte
                        </h5>
                        <div class="d-flex flex-row flex-wrap gap-2">
                            <template
                                v-for="(item, key) in data.peers"
                                :key="key"
                            >
                                <DConnectionPeerCard :entity="item" />
                            </template>
                        </div>

                        <template v-if="data.peers.length === 0">
                            <div class="alert alert-sm alert-info">
                                Es sind keine externen Standorte erreichbar.
                            </div>
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
