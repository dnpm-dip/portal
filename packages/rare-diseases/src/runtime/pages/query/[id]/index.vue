<script lang="ts">
import { Nav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { RDQuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        Nav,
    },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
    setup() {
        const navItems = [
            {
                name: 'Overview', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Summary', icon: 'fa-solid fa-newspaper', urlSuffix: '/summary',
            },
        ];

        return {
            navItems,
        };
    },
});
</script>
<template>
    <div>
        <div>
            <h4>Query <small class="text-muted">{{ entity.id }}</small></h4>
        </div>
        <div class="mb-3">
            <Nav
                :items="navItems"
                :path="'/rd/query/' + entity.id"
            />
        </div>

        <NuxtPage :entity="entity" />
    </div>
</template>
