<script lang="ts">

import { useStore } from '@authup/client-web-kit';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { defineNuxtComponent, useRouter } from '#app';
import { definePageMeta } from '#imports';

export default defineNuxtComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const router = useRouter();
        const store = useStore();

        const query = {
            redirect: '',
        };

        const { redirect } = router.currentRoute.value.query;

        if (
            redirect &&
            typeof redirect === 'string' &&
            !redirect.includes('logout')
        ) {
            query.redirect = redirect;
        }

        await store.logout();

        await router.push({ path: '/login', query });
    },
});
</script>
