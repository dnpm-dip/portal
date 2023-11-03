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
            <i class="fa fa-home" /> Überblick
        </h1>

        <p>
            Das Modul "Seltene Krankheiten" innerhalb der DNPM:dip-Plattform wurde entwickelt, um den besonderen Anforderungen im Zusammenhang mit seltenen Krankheiten gerecht zu werden.
        </p>
    </div>
</template>
