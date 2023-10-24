<template>
    <div>
        <div class="page-sidebar">
            <navigation-components
                class="sidebar-menu navbar-nav"
                :tier="1"
            />
        </div>
    </div>
</template>
<script>
import { NavigationComponents } from '@vue-layout/navigation';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        NavigationComponents,
    },
    setup() {

    },
});
</script>
