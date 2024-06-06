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
    <div>
        <h6>
            <i class="fa fa-map-marker-alt" /> Standorte
        </h6>
    </div>
    <div class="d-flex flex-row gap-2">
        <template
            v-for="(item, key) in entity.peers"
            :key="key"
        >
            <DConnectionPeerCard :entity="item" />
        </template>
    </div>
</template>
