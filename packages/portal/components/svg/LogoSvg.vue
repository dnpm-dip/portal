<script setup lang="ts">
/*
 * DNPM:DIP brand mark — a double helix drawn from the brand tokens:
 * the slate primary strand, the coral accent strand and mauve
 * base-pair rungs. Strokes consume the CSS custom properties, so the
 * mark follows the active theme (and stays legible on both the light
 * and dark chrome).
 */
withDefaults(defineProps<{ height?: number }>(), { height: 28 });
</script>

<template>
    <svg
        :height="height"
        viewBox="0 0 40 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="DNPM:DIP Logo"
    >
        <g
            stroke="var(--dnpm-brand-mauve)"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.9"
        >
            <path d="M13 6H27" />
            <path d="M14.5 10H25.5" />
            <path d="M14.5 22H25.5" />
            <path d="M12.5 28H27.5" />
            <path d="M14.5 34H25.5" />
            <path d="M14.5 46H25.5" />
            <path d="M13 50H27" />
        </g>
        <path
            d="M29 2 C29 16, 11 14, 11 28 C11 42, 29 40, 29 54"
            stroke="var(--vc-color-primary-500)"
            stroke-width="3.5"
            stroke-linecap="round"
        />
        <path
            d="M11 2 C11 16, 29 14, 29 28 C29 42, 11 40, 11 54"
            stroke="var(--dnpm-brand-coral)"
            stroke-width="3.5"
            stroke-linecap="round"
        />
    </svg>
</template>
