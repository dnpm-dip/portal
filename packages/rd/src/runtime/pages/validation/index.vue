<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineComponent } from 'vue';
import { VCAlert } from '@vuecs/elements';
import { VCIcon } from '@vuecs/icon';
import { DValidationReportCard, DValidations } from '@dnpm-dip/core';

export default defineComponent({
    components: {
        VCAlert,
        VCIcon,
        DValidationReportCard,
        DValidations,
    },
});
</script>
<template>
    <div>
        <header class="mb-4 flex items-center gap-4">
            <span
                class="flex size-12 shrink-0 items-center justify-center rounded-xl
                       bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary shadow-md"
            >
                <VCIcon name="fa6-solid:shield" />
            </span>
            <div class="min-w-0">
                <h1 class="mb-0 text-2xl font-bold tracking-tight">
                    Validierungsmeldungen
                </h1>
                <p class="mb-0 text-sm text-fg-muted">
                    Seltene Erkrankungen
                </p>
            </div>
        </header>
        <DValidations :use-case="'rd'">
            <template #default="props">
                <div class="mb-2 flex items-center">
                    <span class="section-label">
                        <VCIcon name="fa6-solid:shield" />
                        Meldungen
                    </span>
                    <span class="ms-auto text-sm text-fg-muted">
                        {{ props.total }} insgesamt
                    </span>
                </div>
                <template v-if="props.data.length > 0">
                    <div class="flex flex-col gap-3">
                        <template
                            v-for="item in props.data"
                            :key="item.id"
                        >
                            <DValidationReportCard
                                :use-case="'rd'"
                                :info="item"
                            />
                        </template>
                    </div>
                </template>
                <template v-else>
                    <VCAlert
                        color="info"
                        variant="soft"
                        size="sm"
                    >
                        Es liegen keine Meldungen vor.
                    </VCAlert>
                </template>
            </template>
        </DValidations>
    </div>
</template>
