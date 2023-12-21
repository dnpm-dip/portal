<template>
    <div>
        <div class="page-sidebar">
            <VCNavItems
                class="sidebar-menu navbar-nav"
                :tier="1"
            />
        </div>
    </div>
</template>
<script>
import { VCNavItems } from '@vuecs/navigation';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCNavItems,
    },
    setup() {

    },
});
</script>
