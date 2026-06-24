<script lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { VCNavItems } from '@vuecs/navigation';
import { injectStore } from '@authup/client-web-kit';
import { useColorMode } from '#imports';
import { defineNuxtComponent } from '#app';
import { LayoutTopNavigationRegistryId, injectNavigation } from '../core';
import LogoSvg from './svg/LogoSvg.vue';

export default defineNuxtComponent({
    components: { LogoSvg, VCNavItems },
    setup() {
        const store = injectStore();
        const { loggedIn, user } = storeToRefs(store);

        const displayNav = ref(false);

        const toggleNav = () => {
            displayNav.value = !displayNav.value;
        };

        const navigation = injectNavigation();
        const topItems = () => navigation.getTopItems();
        const topItemsWatch = [
            () => store.loggedIn,
            () => store.userId,
        ];

        const { isDark } = useColorMode();
        const toggleColorMode = () => {
            isDark.value = !isDark.value;
        };

        return {
            loggedIn,
            user,
            toggleNav,
            displayNav,
            topItems,
            topItemsWatch,
            topRegistryId: LayoutTopNavigationRegistryId,
            isDark,
            toggleColorMode,
        };
    },
});
</script>
<template>
    <div>
        <header class="page-header fixed-top">
            <div class="header-title">
                <div class="toggle-box">
                    <button
                        type="button"
                        class="toggle-trigger"
                        @click="toggleNav"
                    >
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                    </button>
                </div>
                <div class="logo">
                    <LogoSvg :height="30" />
                    <span>DIP</span>
                </div>
            </div>

            <nav class="page-navbar md:flex-nowrap md:justify-start">
                <div
                    id="page-navbar"
                    class="navbar-content grow basis-full items-center md:flex"
                    :class="displayNav ? 'flex' : 'hidden'"
                >
                    <VCNavItems
                        class="flex flex-col list-none md:flex-row"
                        :data="topItems"
                        :watch="topItemsWatch"
                        registry
                        :registry-id="topRegistryId"
                    />

                    <ul class="flex flex-col list-none md:flex-row vc-nav-items navbar-gadgets">
                        <li class="vc-nav-item">
                            <button
                                type="button"
                                class="vc-nav-link"
                                :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                                :aria-pressed="isDark ? 'true' : 'false'"
                                @click.prevent="toggleColorMode"
                            >
                                <VCIcon :name="isDark ? 'fa6-solid:sun' : 'fa6-solid:moon'" />
                            </button>
                        </li>
                        <template v-if="loggedIn && user">
                            <li class="vc-nav-item">
                                <a
                                    href="javascript:void(0)"
                                    class="vc-nav-link"
                                >
                                    <span>{{ user.display_name ? user.display_name : user.name }}</span>
                                </a>
                            </li>
                            <li class="vc-nav-item">
                                <NuxtLink
                                    :to="'/logout'"
                                    class="vc-nav-link"
                                >
                                    <VCIcon name="fa6-solid:power-off" />
                                </NuxtLink>
                            </li>
                        </template>
                    </ul>
                </div>
            </nav>
        </header>
    </div>
</template>
