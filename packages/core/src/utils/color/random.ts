/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hslToRgb } from './hsl-to-rgb';
import type { RGB } from './types';

export function generateRandomColorTuple(distance: number) : [RGB, RGB] {
    const section = Math.round(Math.random() * 6);
    const angle = 60 * section;

    const left = angle / 360;
    const right = (angle + (60 / distance)) / 360;

    return [
        hslToRgb({ h: left, l: 0.5, s: 0.1 }),
        hslToRgb({ h: right, l: 0.5, s: 1.0 }),
    ];
}
