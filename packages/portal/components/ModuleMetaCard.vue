<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { usePermissionCheck } from '@authup/client-web-kit';
import { type ModuleMeta, PageMetaKey } from '@dnpm-dip/core';
import { VCLink } from '@vuecs/link';
import { type PropType, computed, defineComponent } from 'vue';

export default defineComponent({
    components: {
        VCLink,
    },
    props: {
        entity: {
            type: Object as PropType<ModuleMeta>,
            required: true,
        },
    },
    setup(props) {
        const permissions = computed<string[]>(() => props.entity[PageMetaKey.REQUIRED_PERMISSIONS] || []);
        const display = computed(() => usePermissionCheck({ name: permissions.value }));

        return {
            display,
        };
    },
});
</script>
<template>
    <div
        v-if="display"
        class="entity-card w-100 ratio-1x1"
    >
        <h3 class="mb-0">
            <VCLink
                :to="entity.baseURL"
                class="stretched-link"
            >
                {{ entity.name }}
            </VCLink>
        </h3>

        <template v-if="entity.description">
            <p>{{ entity.description }}</p>
        </template>
    </div>
</template>
