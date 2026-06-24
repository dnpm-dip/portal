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
    components: { VCLink },
    props: {
        entity: {
            type: Object as PropType<ModuleMeta>,
            required: true,
        },
        icon: {
            type: String,
            default: 'fa6-solid:circle-nodes',
        },
    },
    setup(props) {
        const permissions = computed<string[]>(() => props.entity[PageMetaKey.REQUIRED_PERMISSIONS] || []);
        const display = usePermissionCheck({ name: permissions.value });

        return { display };
    },
});
</script>
<template>
    <!-- Deliberately NOT .entity-card: its unlayered word-break/padding
         rules beat utility overrides and break prose descriptions. -->
    <VCLink
        v-if="display"
        :to="entity.baseURL"
        class="group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-border bg-bg-muted p-6
               text-start text-fg no-underline shadow-sm transition-all duration-300
               hover:-translate-y-1 hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/10"
    >
        <span
            class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-(--dnpm-brand-coral) via-(--dnpm-brand-mauve) to-primary-500"
            aria-hidden="true"
        />

        <div class="flex items-center gap-4">
            <span
                class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
                       text-xl text-on-primary shadow-md transition-transform duration-300 group-hover:scale-110"
            >
                <VCIcon :name="icon" />
            </span>
            <div class="min-w-0">
                <h3 class="mb-0 text-lg leading-tight">
                    <slot name="title">
                        {{ entity.name }}
                    </slot>
                </h3>
                <span
                    v-if="$slots.subtitle"
                    class="text-sm font-semibold tracking-widest text-fg-muted uppercase"
                >
                    <slot name="subtitle" />
                </span>
            </div>
        </div>

        <p
            v-if="$slots.default || entity.description"
            class="mb-0 text-sm leading-relaxed text-fg-muted"
        >
            <slot>{{ entity.description }}</slot>
        </p>

        <span
            class="mt-auto inline-flex items-center gap-2 self-start rounded-full bg-primary-500/10 px-4 py-1.5
                   text-sm font-semibold text-primary-600 transition-colors duration-300
                   group-hover:bg-primary-600 group-hover:text-on-primary dark:text-primary-200"
        >
            Öffnen
            <VCIcon
                name="fa6-solid:arrow-right"
                class="transition-transform duration-300 group-hover:translate-x-1"
            />
        </span>
    </VCLink>
</template>
