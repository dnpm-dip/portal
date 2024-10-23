<script>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { VCNavItems } from '@vuecs/navigation';
import { useStore } from '@authup/client-web-kit';
import { defineNuxtComponent, useNuxtApp } from '#app';

export default defineNuxtComponent({
    components: {
        VCNavItems,
    },
    setup() {
        const store = useStore();
        const { loggedIn, user } = storeToRefs(store);

        const displayNav = ref(false);

        const toggleNav = () => {
            displayNav.value = !displayNav.value;
        };

        return {
            loggedIn,
            user,
            toggleNav,
            displayNav,
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
                    DNPM:DIP
                </div>
            </div>

            <nav class="page-navbar navbar-expand-md">
                <div
                    id="page-navbar"
                    class="navbar-content navbar-collapse collapse"
                    :class="{'show': displayNav}"
                >
                    <VCNavItems
                        class="navbar-nav"
                        :level="0"
                    />

                    <ul
                        v-if="loggedIn && user"
                        class="navbar-nav vc-nav-items navbar-gadgets"
                    >
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
                                <i class="fa fa-power-off" />
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    </div>
</template>
