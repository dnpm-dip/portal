<script>
import { defineNuxtComponent } from '#app';
import { useAPIClient } from '#imports';

export default defineNuxtComponent({
    async setup() {
        const api = useAPIClient();

        const codings = await api.codeSystem.getMany();

        return {
            codings,
        };
    },
});
</script>
<template>
    <div>
        <h1 class="mb-3">
            <i class="fa fa-home" /> Overview
        </h1>

        <p>
            The Rare Disease module within the DNPM:dip platform is designed to tackle the unique demands linked to rare medical conditions.
        </p>
    </div>
</template>
