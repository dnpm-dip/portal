<script lang="ts">

import { VCAlertDialogProvider, VCToastProvider, VCToaster } from '@vuecs/overlays';
import PageHeader from '../components/header.vue';
import PageSidebar from '../components/sidebar.vue';
import PageFooter from '../components/footer.vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCAlertDialogProvider,
        VCToastProvider,
        VCToaster,
        PageHeader,
        PageSidebar,
        PageFooter,
    },
});
</script>

<template>
    <VCToastProvider>
        <div id="app">
            <PageHeader />
            <div class="page-wrapper">
                <PageSidebar />
                <div class="page-content">
                    <slot />
                </div>
            </div>
            <VCToaster position="top-center" />
            <VCAlertDialogProvider />
            <PageFooter />
        </div>
    </VCToastProvider>
</template>
