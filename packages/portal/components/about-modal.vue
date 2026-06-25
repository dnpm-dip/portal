<script setup lang="ts">
import { TOOLS } from '../config/tools';
import LogoSvg from './svg/LogoSvg.vue';
import { VCIcon } from '@vuecs/icon';
import { VCModal, VCModalContent } from '@vuecs/overlays';

defineProps<{
    modelValue: boolean,
    version?: string
}>();

defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const tools = TOOLS;
</script>

<template>
    <VCModal
        :open="modelValue"
        @update:open="$emit('update:modelValue', $event)"
    >
        <VCModalContent>
            <div class="flex items-center justify-between border-b border-border px-4 py-3">
                <h6 class="mb-0">
                    Über
                </h6>
                <VCModalClose class="cursor-pointer border-0 bg-transparent text-fg-muted hover:text-fg" />
            </div>
            <div class="px-4 py-3 text-sm">
                <div class="mb-3 flex items-center gap-3">
                    <LogoSvg :height="40" />
                    <div>
                        <div class="font-semibold">
                            DNPM:DIP Portal
                        </div>
                        <div class="text-fg-muted">
                            {{ version }}
                        </div>
                    </div>
                </div>
                <p class="mb-3">
                    Die Datenintegrationsplattform (DIP) des Deutschen Netzwerks
                    für Personalisierte Medizin — Patientensuche und Visualisierung
                    medizinischer Daten in Fachdomänen wie Molekularen Tumorboards
                    und Seltenen Erkrankungen.
                </p>
                <p class="mb-3">
                    Veröffentlicht unter der
                    <a
                        href="https://github.com/dnpm-dip/portal/blob/master/LICENSE"
                        target="_blank"
                        rel="noopener"
                        class="text-primary-600 hover:underline dark:text-primary-200"
                    >MIT-Lizenz</a>.
                    Der Quellcode ist auf
                    <a
                        href="https://github.com/dnpm-dip/portal"
                        target="_blank"
                        rel="noopener"
                        class="text-primary-600 hover:underline dark:text-primary-200"
                    >GitHub</a>
                    verfügbar.
                </p>
                <p class="mb-3">
                    Das Portal entstand im Rahmen der Masterarbeit
                    <a
                        href="https://placzek.dev/master-thesis.pdf"
                        target="_blank"
                        rel="noopener"
                        class="text-primary-600 hover:underline dark:text-primary-200"
                    >„Development of a portal for patient search in
                        personalized medicine“</a>
                    von
                    <a
                        href="https://placzek.dev"
                        target="_blank"
                        rel="noopener"
                        class="text-primary-600 hover:underline dark:text-primary-200"
                    >Peter Placzek</a>
                    (Eberhard Karls Universität Tübingen, 2024).
                </p>
                <p class="mb-3">
                    Die Benutzeroberfläche und der Identity-Provider (authup)
                    stammen von Peter Placzek, die
                    <a
                        href="https://github.com/dnpm-dip"
                        target="_blank"
                        rel="noopener"
                        class="text-primary-600 hover:underline dark:text-primary-200"
                    >Backend-Dienste</a>
                    der Plattform von
                    <a
                        href="https://github.com/lucienclin"
                        target="_blank"
                        rel="noopener"
                        class="text-primary-600 hover:underline dark:text-primary-200"
                    >Lucien Clin</a>.
                </p>
                <div class="section-label mb-2">
                    Mit Open Source entwickelt
                </div>
                <ul class="m-0 flex list-none flex-col gap-1.5 p-0">
                    <li
                        v-for="tool in tools"
                        :key="tool.name"
                    >
                        <a
                            :href="tool.website"
                            target="_blank"
                            rel="noopener"
                            class="text-primary-600 hover:underline dark:text-primary-200"
                        >{{ tool.name }}</a>
                        <a
                            :href="tool.repository"
                            target="_blank"
                            rel="noopener"
                            class="ms-1 inline-flex items-center align-text-bottom text-fg-muted hover:text-primary-600 dark:hover:text-primary-200"
                            :aria-label="`${tool.name} auf GitHub`"
                        ><VCIcon name="fa6-brands:github" /></a>
                        — {{ tool.description }}
                    </li>
                </ul>
            </div>
        </VCModalContent>
    </VCModal>
</template>
