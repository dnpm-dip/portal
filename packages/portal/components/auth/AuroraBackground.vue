<script lang="ts">
import {
    defineComponent,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';

// Aurora — soft, drifting colour ribbons in the brand palette. Calm and
// clinically restrained: each ribbon is a wavy band filled with a vertical
// gradient that fades at both edges, its phase slowly advancing so the field
// breathes. Additive blending gives a glow over the dark ground; on the light
// ground it falls back to normal alpha so the ribbons don't wash out to white.
type Band = {
    y: number; // vertical centre (fraction of height)
    tone: 'coral' | 'mauve' | 'slate';
    amp: number; // wave amplitude (fraction of height)
    thickness: number; // ribbon height (fraction of height)
    waves: number; // full waves across the width
    speed: number; // phase drift (rad/s); sign sets direction
    phase: number; // starting phase
};

const BANDS: Band[] = [
    {
        y: 0.28, 
        tone: 'coral', 
        amp: 0.05, 
        thickness: 0.14, 
        waves: 1.1, 
        speed: 0.22, 
        phase: 0.0,
    },
    {
        y: 0.44, 
        tone: 'mauve', 
        amp: 0.07, 
        thickness: 0.17, 
        waves: 0.8, 
        speed: -0.18, 
        phase: 1.6,
    },
    {
        y: 0.58, 
        tone: 'slate', 
        amp: 0.045, 
        thickness: 0.13, 
        waves: 1.3, 
        speed: 0.2, 
        phase: 3.0,
    },
    {
        y: 0.72, 
        tone: 'coral', 
        amp: 0.06, 
        thickness: 0.12, 
        waves: 0.9, 
        speed: -0.24, 
        phase: 4.2,
    },
];

const STEPS = 64; // horizontal samples per ribbon edge

export default defineComponent({
    name: 'AuroraBackground',
    props: {
        // Re-read the palette whenever the color mode flips so the canvas
        // colors track the active theme (the parent owns the dark ref).
        dark: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
        const canvas = ref<HTMLCanvasElement | null>(null);

        let ctx: CanvasRenderingContext2D | null = null;
        let raf = 0;
        let observer: ResizeObserver | null = null;
        let dpr = 1;
        let last = 0;
        let reduced = false;
        // Detached element used to let the browser normalize arbitrary color
        // tokens (oklch()/hsl()/named) to rgb when resolving the palette.
        let probe: HTMLSpanElement | null = null;

        // Fresh, mutable per-mount ribbon state (phase advances each frame).
        const bands = BANDS.map((b) => ({ ...b }));

        // Colors resolved from the theme's CSS custom properties so a palette /
        // light-dark switch flows straight through to the canvas.
        const palette = {
            coral: [246, 85, 82] as number[], // --dnpm-brand-coral
            mauve: [199, 177, 189] as number[], // --dnpm-brand-mauve
            slate: [92, 102, 112] as number[], // --vc-color-primary-500 (slate)
        };

        const parseRGB = (input: string): number[] | null => {
            const body = input.match(/rgba?\(([^)]+)\)/)?.[1];
            if (!body) {
                return null;
            }
            // Handles both legacy "r, g, b" and modern "r g b / a" syntaxes.
            const [r, g, b] = body.split(/[\s,/]+/).map((s) => Number.parseFloat(s));
            if (r != null && g != null && b != null &&
                !Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
                return [r, g, b];
            }
            return null;
        };

        const toRGB = (input: string, fallback: number[]): number[] => {
            const value = input.trim();
            if (!value) {
                return fallback;
            }
            if (value.startsWith('#')) {
                let hex = value.slice(1);
                if (hex.length === 3) {
                    hex = hex.split('').map((c) => c + c).join('');
                }
                const n = Number.parseInt(hex, 16);
                if (hex.length === 6 && !Number.isNaN(n)) {
                    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
                }
                return fallback;
            }
            const direct = parseRGB(value);
            if (direct) {
                return direct;
            }
            // General path: the theme's neutrals resolve to oklch() (Tailwind v4),
            // which neither the hex nor the rgb() branch can read. Let the browser
            // compute it on the probe — getComputedStyle always reports rgb().
            if (probe && typeof window !== 'undefined') {
                probe.style.color = '';
                probe.style.color = value;
                const computed = parseRGB(window.getComputedStyle(probe).color);
                if (computed) {
                    return computed;
                }
            }
            return fallback;
        };

        const readPalette = () => {
            if (typeof window === 'undefined') {
                return;
            }
            const styles = window.getComputedStyle(document.documentElement);
            const read = (name: string, fallback: number[]) => toRGB(styles.getPropertyValue(name), fallback);
            palette.coral = read('--dnpm-brand-coral', [246, 85, 82]);
            palette.mauve = read('--dnpm-brand-mauve', [199, 177, 189]);
            palette.slate = read('--vc-color-primary-500', [92, 102, 112]);
        };

        const rgba = (c: number[], a: number) => {
            const [r = 0, g = 0, b = 0] = c;
            return `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`;
        };

        const toneOf = (band: Band) => {
            if (band.tone === 'coral') {
                return palette.coral;
            }
            if (band.tone === 'mauve') {
                return palette.mauve;
            }
            return palette.slate;
        };

        const resize = () => {
            const el = canvas.value;
            if (!el) {
                return;
            }
            // Re-sample DPR on every resize (not just at mount) so browser zoom
            // or a move to a higher-density display re-scales the backbuffer.
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = el.getBoundingClientRect();
            el.width = Math.max(1, Math.round(rect.width * dpr));
            el.height = Math.max(1, Math.round(rect.height * dpr));
        };

        const draw = (now: number) => {
            const el = canvas.value;
            if (!el || !ctx) {
                return;
            }

            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;

            const w = el.width;
            const h = el.height;

            ctx.clearRect(0, 0, w, h);

            // Additive glow reads well over the dark ground; on the light ground
            // it blows out to white, so fall back to normal alpha there.
            const additive = props.dark;
            ctx.globalCompositeOperation = additive ? 'lighter' : 'source-over';
            const midAlpha = additive ? 0.2 : 0.32;

            for (const band of bands) {
                if (!reduced) {
                    band.phase += band.speed * dt;
                }

                const tone = toneOf(band);
                const grad = ctx.createLinearGradient(0, (band.y - 0.02) * h, 0, (band.y + band.thickness + 0.04) * h);
                grad.addColorStop(0, rgba(tone, 0));
                grad.addColorStop(0.5, rgba(tone, midAlpha));
                grad.addColorStop(1, rgba(tone, 0));

                const points = Array.from({ length: STEPS + 1 }, (_, i) => {
                    const nx = i / STEPS;
                    const yc = (band.y +
                        Math.sin(nx * Math.PI * 2 * band.waves + band.phase) * band.amp +
                        Math.sin(nx * Math.PI * 2 * band.waves * 2.3 - band.phase * 1.3) * band.amp * 0.4) * h;
                    return {
                        x: nx * w, 
                        top: yc, 
                        bottom: yc + band.thickness * h, 
                    };
                });

                ctx.fillStyle = grad;
                ctx.beginPath();
                let started = false;
                for (const p of points) {
                    if (started) {
                        ctx.lineTo(p.x, p.top);
                    } else {
                        ctx.moveTo(p.x, p.top);
                        started = true;
                    }
                }
                for (const p of points.slice().reverse()) {
                    ctx.lineTo(p.x, p.bottom);
                }
                ctx.closePath();
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';

            if (!reduced) {
                raf = window.requestAnimationFrame(draw);
            }
        };

        const onWindowResize = () => {
            resize();
            if (reduced) {
                draw(last);
            }
        };

        onMounted(() => {
            const el = canvas.value;
            if (!el) {
                return;
            }
            ctx = el.getContext('2d');
            reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            probe = document.createElement('span');
            probe.setAttribute('aria-hidden', 'true');
            probe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;pointer-events:none;';
            document.body.appendChild(probe);

            readPalette();
            resize();
            window.addEventListener('resize', onWindowResize);

            observer = new ResizeObserver(() => {
                resize();
                if (reduced) {
                    draw(0); // repaint the static frame at the new size
                }
            });
            observer.observe(el);

            last = window.performance.now();
            if (reduced) {
                draw(last); // one static frame, no loop
            } else {
                raf = window.requestAnimationFrame(draw);
            }
        });

        onBeforeUnmount(() => {
            if (raf) {
                window.cancelAnimationFrame(raf);
            }
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            window.removeEventListener('resize', onWindowResize);
            if (probe) {
                probe.remove();
                probe = null;
            }
            ctx = null;
        });

        watch(() => props.dark, () => {
            readPalette();
            if (reduced) {
                draw(last);
            }
        });

        return { canvas };
    },
});
</script>
<template>
    <canvas
        ref="canvas"
        class="aurora-bg"
        aria-hidden="true"
    />
</template>
<style scoped>
.aurora-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    /* Decorative, aria-hidden layer — never intercept pointer events. */
    pointer-events: none;
}
</style>
