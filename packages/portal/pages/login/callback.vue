<script lang="ts">
import { VCIcon } from '@vuecs/icon';
import { PageMetaKey } from '@dnpm-dip/core';
import { defineNuxtComponent, navigateTo } from '#app';
import { definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: { VCIcon },
    async setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            layout: 'auth',
        });

        // The global routing interceptor (@authup/client-web-nuxt) exchanges
        // the authorization code and, when an in-app target was stored,
        // redirects there. Reaching this component means the exchange
        // succeeded without a stored target.
        await navigateTo({ path: '/' });
    },
});
</script>
<template>
    <div class="login-callback">
        <VCIcon
            name="fa6-solid:spinner"
            class="login-callback-spinner"
        />
    </div>
</template>
<style scoped>
.login-callback {
    position: relative;
    z-index: 1;
    text-align: center;
    font-size: 1.5rem;
    color: var(--vc-color-fg-muted, #9aa6bd);
}

.login-callback-spinner {
    animation: login-callback-spin 0.9s linear infinite;
}

@keyframes login-callback-spin {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .login-callback-spinner {
        animation: none;
    }
}
</style>
