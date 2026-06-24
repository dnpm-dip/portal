<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { ConnectionPeer } from '../../../domains';
import { ConnectionPeerStatus } from '../../../domains';

export default defineComponent({
    props: { entity: { type: Object as PropType<ConnectionPeer> } },
    setup(props) {
        const online = computed(
            () => !props.entity || props.entity.status === ConnectionPeerStatus.ONLINE,
        );

        return { online };
    },
});
</script>
<template>
    <div class="entity-card connection-peer-card flex min-w-72 flex-col gap-2">
        <div class="flex items-center gap-2">
            <span
                class="flex size-8 shrink-0 items-center justify-center rounded-lg
                       bg-primary-500/10 text-primary-600 dark:text-primary-200"
            >
                <VCIcon name="fa6-solid:hospital" />
            </span>
            <h6 class="mb-0 min-w-0 flex-1 truncate text-base">
                <template v-if="entity">
                    {{ entity.site.display || entity.site.code }}
                </template>
                <template v-else>
                    <span class="placeholder w-8/12 px-2" />
                </template>
            </h6>
            <span
                class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                :class="online ? 'bg-success-500/10 text-success-600' : 'bg-error-500/10 text-error-600'"
            >
                <span
                    class="size-1.5 rounded-full"
                    :class="online ? 'bg-success-500' : 'bg-error-500'"
                />
                <template v-if="entity">
                    {{ entity.status }}
                </template>
                <template v-else>
                    &hellip;
                </template>
            </span>
        </div>
        <p class="mb-0 text-sm text-fg-muted">
            <template v-if="entity">
                {{ entity.details }}
            </template>
            <template v-else>
                <span class="placeholder w-full px-2" />
            </template>
        </p>
    </div>
</template>
