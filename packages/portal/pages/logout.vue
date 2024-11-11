<script lang="ts">
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { defineNuxtComponent } from '#app';
import { definePageMeta, navigateTo } from '#imports';

export default defineNuxtComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_OUT]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        await navigateTo({ path: '/login' });
    },
});
</script>
