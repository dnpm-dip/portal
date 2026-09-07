/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { HSL, RGB } from './types';

export function hslToRgb(hsl: HSL) : RGB {
    let rgb : RGB;
    if (hsl.s === 0) {
        rgb = {
            r: hsl.l,
            g: hsl.l,
            b: hsl.l,
        };
    } else {
        const q = hsl.l < 0.5 ? hsl.l * (1 + hsl.s) : hsl.l + hsl.s - hsl.l * hsl.s;
        const p = 2 * hsl.l - q;
        rgb = {
            r: hueToRgb(p, q, hsl.h + 1 / 3),
            g: hueToRgb(p, q, hsl.h),
            b: hueToRgb(p, q, hsl.h - 1 / 3),
        };
    }

    return {
        r: Math.round(rgb.r * 255),
        b: Math.round(rgb.b * 255),
        g: Math.round(rgb.g * 255),
    };
}

function hueToRgb(p: number, q: number, t: number) : number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
