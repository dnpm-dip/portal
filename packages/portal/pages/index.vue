<template>
    <div class="container text-center">
        <h1>DNPM:DIP</h1>
        <WorldHealth :style="{'width': '800px'}" />
    </div>
</template>
<script lang="ts">
import { defineNuxtComponent } from '#imports';
import WorldHealth from '../components/svg/WorldHealth';

export default defineNuxtComponent({
    components: {
        WorldHealth,
    },
});
</script>
