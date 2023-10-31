<script>
import { ref } from 'vue';
import { NavigationComponents } from '@vue-layout/navigation';
import { defineNuxtComponent, useNuxtApp } from '#app';

export default defineNuxtComponent({
    components: {
        NavigationComponents,
    },
    setup() {
        const displayNav = ref(false);

        const toggleNav = () => {
            displayNav.value = !displayNav.value;
        };

        return {
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
                    <navigation-components
                        class="navbar-nav"
                        :tier="0"
                    />
                </div>
            </nav>
        </header>
    </div>
</template>
