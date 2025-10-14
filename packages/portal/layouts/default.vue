<script lang="ts">

import { BOrchestrator } from 'bootstrap-vue-next';
import PageHeader from '../components/header.vue';
import PageSidebar from '../components/sidebar.vue';
import PageFooter from '../components/footer.vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        BOrchestrator, PageHeader, PageSidebar, PageFooter,
    },
});
</script>

<template>
    <div id="app">
        <PageHeader />
        <div class="page-wrapper">
            <PageSidebar />
            <div class="page-content">
                <NuxtPage />
            </div>
        </div>
        <BOrchestrator />
        <PageFooter />
    </div>
</template>
