<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { DAdminConnectionReport, DConnectionPeerCard } from '@dnpm-dip/core';
import { defineNuxtComponent } from '#imports';

export default defineNuxtComponent({
    components: { DConnectionPeerCard, DAdminConnectionReport },
});
</script>
<template>
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
