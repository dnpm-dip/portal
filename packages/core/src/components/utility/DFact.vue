<!--
  - Copyright (c) 2026.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        label: {
            type: String,
            required: true,
        },
        icon: { type: String },
    },
});
</script>
<template>
    <div class="flex min-w-0 flex-col">
        <span class="inline-flex items-center gap-1 text-xs font-medium text-fg-muted">
            <VCIcon
                v-if="icon"
                :name="icon"
            />
            {{ label }}
        </span>
        <span class="text-sm">
            <slot />
        </span>
    </div>
</template>
