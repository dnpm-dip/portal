<template>
    <div class="container text-center">
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
import { computed } from 'vue';
import { ModuleType, PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { storeToRefs } from '@authup/client-web-kit';
import { defineNuxtComponent, definePageMeta } from '#imports';
import ModuleMetaCard from '../components/ModuleMetaCard.vue';
import WorldHealth from '../components/svg/WorldHealth';
import { useModuleStore } from '../stores/modules';

export default defineNuxtComponent({
    components: {
        ModuleMetaCard,
        WorldHealth,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const moduleStore = useModuleStore();
        const refs = storeToRefs(moduleStore);

        const items = computed(() => refs.items.value.filter((item) => item.type === ModuleType.USE_CASE));

        return {
            items,
        };
    },
});
</script>
