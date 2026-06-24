<template>
    <div class="container relative">
        <div
            class="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-96 overflow-hidden"
            aria-hidden="true"
        >
            <div class="absolute -top-16 left-1/4 size-72 rounded-full bg-primary-500/15 blur-3xl" />
            <div class="absolute top-12 right-1/4 size-72 rounded-full bg-(--dnpm-brand-coral)/10 blur-3xl" />
        </div>

        <section class="text-center">
            <!-- Tailwind preflight makes <img> display:block — without
                 mx-auto the fixed-width illustration left-aligns; the fixed
                 height keeps the page from jumping while the SVG loads. -->
            <WorldHealth
                class="mx-auto"
                :style="{ width: '640px', height: '320px' }"
            />

            <span
                class="inline-flex items-center rounded-full border border-border bg-bg-muted px-3 py-1
                       text-xs font-semibold tracking-widest text-fg-muted uppercase"
            >
                Deutsches Netzwerk für Personalisierte Medizin
            </span>

            <h1 class="mt-4 mb-3 text-4xl font-bold tracking-tight">
                Willkommen im
                <span class="bg-gradient-to-r from-(--dnpm-brand-ink) to-(--dnpm-brand-coral) bg-clip-text text-transparent">
                    DNPM:DIP
                </span>
                Portal
            </h1>
            <p class="mx-auto mb-0 max-w-xl text-lg text-fg-muted">
                Der zentrale Einstiegspunkt für die Patientensuche in der
                personalisierten Medizin. Wählen Sie einen Anwendungsfall,
                um zu starten.
            </p>
        </section>

        <section class="mx-auto mt-10 max-w-3xl pb-10">
            <h2 class="mb-6 flex items-center gap-4 text-sm font-semibold tracking-widest text-fg-muted uppercase">
                <span
                    class="h-px flex-1 bg-border"
                    aria-hidden="true"
                />
                Anwendungsfälle
                <span
                    class="h-px flex-1 bg-border"
                    aria-hidden="true"
                />
            </h2>

            <template v-if="items.length > 0">
                <div class="grid gap-6 sm:grid-cols-2">
                    <ModuleMetaCard
                        v-if="mtb"
                        :entity="mtb"
                        icon="fa6-solid:dna"
                    >
                        <template #title>
                            Molekulares Tumorboard
                        </template>
                        <template #subtitle>
                            MTB
                        </template>
                        Patientensuche in der Onkologie: Abfragen nach
                        Tumorentitäten, molekularen Alterationen und Therapien.
                    </ModuleMetaCard>

                    <ModuleMetaCard
                        v-if="rd"
                        :entity="rd"
                        icon="fa6-solid:disease"
                    >
                        <template #title>
                            Seltene Erkrankungen
                        </template>
                        <template #subtitle>
                            RD
                        </template>
                        Patientensuche bei seltenen Erkrankungen: Abfragen nach
                        Diagnosen, Phänotypen (HPO) und genetischen Varianten.
                    </ModuleMetaCard>

                    <ModuleMetaCard
                        v-for="item in others"
                        :key="item.name"
                        :entity="item"
                    />
                </div>
            </template>
            <template v-else>
                <p class="text-center text-fg-muted">
                    Es sind keine Anwendungsfälle registriert.
                </p>
            </template>
        </section>
    </div>
</template>
<script lang="ts">
import { computed } from 'vue';
import { ModuleType, PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { storeToRefs } from '@authup/client-web-kit';
import { defineNuxtComponent, definePageMeta } from '#imports';
import ModuleMetaCard from '../components/ModuleMetaCard.vue';
import WorldHealth from '../components/svg/WorldHealth';
import { useModuleStore } from '../stores/modules';

export default defineNuxtComponent({
    components: {
        ModuleMetaCard,
        WorldHealth,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.DEFAULT,
        });

        const moduleStore = useModuleStore();
        const refs = storeToRefs(moduleStore);

        const items = computed(() => refs.items.value.filter(
            (item) => item.type === ModuleType.USE_CASE,
        ));

        const mtb = computed(() => items.value.find((item) => item.name === 'MTB'));
        const rd = computed(() => items.value.find((item) => item.name === 'RD'));
        const others = computed(() => items.value.filter(
            (item) => item !== mtb.value && item !== rd.value,
        ));

        return {
            items,
            mtb,
            rd,
            others,
        };
    },
});
</script>
