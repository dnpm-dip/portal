<script lang="ts">
import { defineComponent } from 'vue';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { VCNavItems } from '@vuecs/navigation';
import { definePageMeta } from '#imports';

export default defineComponent({
    components: { VCNavItems },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const items = [
            {
                name: 'Account',
                icon: 'fa6-solid:bars',
                url: '/settings',
            },
            {
                name: 'Security',
                icon: 'fa6-solid:lock',
                url: '/settings/security',
            },
        ];

        return { items };
    },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <VCIcon name="fa6-solid:gear" />
            Settings
            <span class="sub-title ms-1">
                Management
            </span>
        </h1>
        <div class="content-wrapper">
            <div class="content-sidebar flex-col">
                <VCNavItems
                    :data="items"
                    variant="pills"
                    orientation="vertical"
                />
            </div>
            <div class="content-container">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>
