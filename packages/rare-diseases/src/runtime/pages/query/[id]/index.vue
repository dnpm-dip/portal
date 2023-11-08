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
                name: 'Überblick', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Patienten', icon: 'fa-solid fa-newspaper', urlSuffix: '/patients',
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
        <div class="d-flex flex-row mb-3">
            <h4>
                <NuxtLink
                    class="btn btn-xs btn-dark me-1"
                    :to="'/rd/search'"
                >
                    <i class="fa fa-arrow-left" />
                </NuxtLink>
                Query <small class="text-muted">{{ entity.id }}</small>
            </h4>
        </div>

        <div class="mb-2">
            <Nav
                :items="navItems"
                :path="'/rd/query/'+ entity.id"
            />
        </div>

        <hr>

        <template v-if="entity">
            <NuxtPage :entity="entity" />
        </template>
    </div>
</template>
