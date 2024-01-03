<script>
import { PageMetaKey } from '@dnpm-dip/core';
import { defineNuxtComponent, definePageMeta } from '#imports';

export default defineNuxtComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'mtb',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'mtb-home',
        });
    },
});
</script>
<template>
    <div>
        <h1 class="mb-3">
            <i class="fa fa-home" /> Überblick
        </h1>

        <p />
    </div>
</template>
