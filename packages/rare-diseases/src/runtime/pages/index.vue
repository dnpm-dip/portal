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
        <h1>Home</h1>
        <pre>
          {{ codings }}
        </pre>
    </div>
</template>
