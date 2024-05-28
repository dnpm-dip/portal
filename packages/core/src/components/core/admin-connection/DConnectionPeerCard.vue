<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { AdminConnectionPeer } from '../../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<AdminConnectionPeer>,
        },
    },
});
</script>
<template>
    <div
        class="entity-card"
        style="min-width: 300px;"
    >
        <div class="text-center">
            <h6>
                <template v-if="entity">
                    {{ entity.site.display || entity.site.code }}
                </template>
                <template v-else>
                    <span class="placeholder col-8" />
                </template>
            </h6>
        </div>
        <div
            class="alert alert-sm text-center mb-2"
            :class="{
                'alert-success': !entity || entity.status === 'online',
                'alert-danger': entity && entity.status === 'offline'
            }"
        >
            <template v-if="entity">
                <strong>{{ entity.status }}</strong>
            </template>
            <template v-else>
                <span class="placeholder col-4" />
            </template>
        </div>
        <div>
            <template v-if="entity">
                {{ entity.details }}
            </template>
            <template v-else>
                <span class="placeholder col-12" />
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>
