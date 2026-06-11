<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { DConnectionPeerCard } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#imports';
import type { QuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: { DConnectionPeerCard },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="mb-2">
        <h6 class="section-label mb-0">
            <VCIcon name="fa6-solid:location-dot" />
            Standorte
        </h6>
    </div>
    <div class="flex flex-row flex-wrap gap-2">
        <template
            v-for="(item, key) in entity.peers"
            :key="key"
        >
            <DConnectionPeerCard :entity="item" />
        </template>
    </div>
</template>
