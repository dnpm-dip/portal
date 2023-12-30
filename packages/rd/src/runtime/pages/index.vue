<script>
import { PageMetaKey } from '@dnpm-dip/core';
import { defineNuxtComponent, definePageMeta } from '#imports';

export default defineNuxtComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'rd',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'rd-home',
        });
    },
});
</script>
<template>
    <div>
        <h1 class="mb-3">
            <i class="fa fa-home" /> Überblick
        </h1>

        <p>
            Das Modul "Seltene Krankheiten" innerhalb der DNPM:dip-Plattform wurde entwickelt,
            um den besonderen Anforderungen im Zusammenhang mit seltenen Krankheiten gerecht zu werden.
        </p>
    </div>
</template>
