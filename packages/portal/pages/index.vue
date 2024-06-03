<template>
    <div class="container text-center">
        <h1>DNPM:DIP</h1>
        <WorldHealth :style="{'width': '800px'}" />

        <div class="d-flex flex-row gap-2">
            <template
                v-for="(item) in items"
                :key="item.name"
            >
                <ModuleMetaCard :entity="item" />
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { VCLink } from '@vuecs/link';
import { storeToRefs } from 'pinia';
import { defineNuxtComponent, definePageMeta } from '#imports';
import ModuleMetaCard from '../components/ModuleMetaCard.vue';
import WorldHealth from '../components/svg/WorldHealth';
import { useModuleStore } from '../stores/modules';

export default defineNuxtComponent({
    components: {
        ModuleMetaCard,
        WorldHealth,
        VCLink,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const moduleStore = useModuleStore();
        const refs = storeToRefs(moduleStore);
        return {
            items: refs.items,
        };
    },
});
</script>
