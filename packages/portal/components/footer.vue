<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRuntimeConfig } from '#imports';
import { TOOLS } from '../config/tools';
import LogoSvg from './svg/LogoSvg.vue';
import AboutModal from './about-modal.vue';

const runtimeConfig = useRuntimeConfig();

const startYear = 2023;
const year = computed(() => {
    const current = new Date().getFullYear();

    return current === startYear ? `${startYear}` : `${startYear}-${current}`;
});

const version = computed(() => {
    if (runtimeConfig.public.version) {
        return `v${runtimeConfig.public.version}`;
    }

    return 'v0.0.0';
});

const aboutVisible = ref(false);
const tools = TOOLS;
</script>

<template>
    <div>
        <footer class="page-footer">
            <div class="page-footer-main">
                <div class="page-footer-brand">
                    <div class="page-footer-brand-title">
                        <LogoSvg :height="24" />
                        <span>DNPM:DIP</span>
                    </div>
                    <p>
                        Datenintegrationsplattform des Deutschen Netzwerks für
                        Personalisierte Medizin — Patientensuche über
                        Fachdomänen hinweg.
                    </p>
                    <button
                        type="button"
                        class="page-footer-about"
                        @click="aboutVisible = true"
                    >
                        Über diese Anwendung
                    </button>
                </div>
                <div>
                    <div class="page-footer-heading">
                        Plattform
                    </div>
                    <ul class="page-footer-links">
                        <li>
                            <a
                                href="https://dnpm.de"
                                target="_blank"
                                rel="noopener"
                            >Homepage</a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/dnpm-dip"
                                target="_blank"
                                rel="noopener"
                            >GitHub</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <div class="page-footer-heading">
                        Entwickelt mit
                    </div>
                    <ul class="page-footer-links">
                        <li
                            v-for="tool in tools"
                            :key="tool.name"
                            class="page-footer-tool"
                        >
                            <span>{{ tool.name }}</span>
                            <a
                                :href="tool.website"
                                target="_blank"
                                rel="noopener"
                                :aria-label="`${tool.name} Dokumentation`"
                            ><VCIcon name="fa6-solid:book" /></a>
                            <a
                                :href="tool.repository"
                                target="_blank"
                                rel="noopener"
                                :aria-label="`${tool.name} auf GitHub`"
                            ><VCIcon name="fa6-brands:github" /></a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="page-footer-bottom">
                <div>
                    &copy; {{ year }} DNPM:DIP
                </div>
                <div>
                    {{ version }}
                </div>
                <div>
                    <a
                        href="https://github.com/dnpm-dip/portal/blob/master/LICENSE"
                        target="_blank"
                        rel="noopener"
                    >MIT</a>
                </div>
            </div>
        </footer>
        <AboutModal
            v-model="aboutVisible"
            :version="version"
        />
    </div>
</template>
