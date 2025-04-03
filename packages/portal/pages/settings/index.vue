<script lang="ts">
import { defineComponent } from 'vue';
import { DNav, PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { definePageMeta } from '#imports';

export default defineComponent({
    components: { DNav },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const items = [
            {
                name: 'Account', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Security', icon: 'fa fa-lock', urlSuffix: '/security',
            },
        ];

        return {
            items,
        };
    },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <i class="fa fa-cog" />
            Settings
            <span class="sub-title ms-1">
                Management
            </span>
        </h1>
        <div class="content-wrapper">
            <div class="content-sidebar flex-column">
                <DNav
                    :items="items"
                    path="/settings"
                    direction="vertical"
                />
            </div>
            <div class="content-container">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>
