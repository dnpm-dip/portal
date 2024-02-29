<template>
    <div class="container text-center">
        <h1>DNPM:DIP</h1>
        <WorldHealth :style="{'width': '800px'}" />

        <div class="d-flex flex-row">
            <template
                v-for="(item) in items"
                :key="item.name"
            >
                <div
                    class="entity-card w-100"
                >
                    <h3 class="mb-0">
                        <VCLink :to="item.baseURL">
                            {{ item.name }}
                        </VCLink>
                    </h3>

                    <template v-if="item.description">
                        <p>{{ item.description }}</p>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import { VCLink } from '@vuecs/link';
import { storeToRefs } from 'pinia';
import { defineNuxtComponent } from '#imports';
import WorldHealth from '../components/svg/WorldHealth';
import { useModuleStore } from '../stores/modules';

export default defineNuxtComponent({
    components: {
        WorldHealth,
        VCLink,
    },
    setup() {
        const moduleStore = useModuleStore();
        const refs = storeToRefs(moduleStore);
        return {
            items: refs.items,
        };
    },
});
</script>
