/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hslToRgb } from './hsl-to-rgb';
import type { RGB } from './types';

export function generateRandomColorTuple(slices = 6) : [RGB, RGB] {
    const sectionSize = Math.floor(360 / slices);
    let section : number;
    if (slices === 1) {
        section = 0;
    } else {
        section = Math.round(Math.random() * slices);
    }
    const sectionMin = sectionSize * section;
    const sectionMax = Math.min(sectionMin + sectionSize, 360);

    const left = sectionMin / 360;
    const right = sectionMax / 360;

    return [
        hslToRgb({ h: left, s: 0.4, l: 0.4 }),
        hslToRgb({ h: right, s: 1.0, l: 0.8 }),
    ];
}
