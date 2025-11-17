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
    <div class="d-flex flex-row flex-wrap gap-2">
        <template
            v-for="(item, key) in entity.peers"
            :key="key"
        >
            <DConnectionPeerCard :entity="item" />
        </template>
    </div>
</template>
