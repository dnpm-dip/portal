import { hexToRgb } from './hex-to-rgb';
import type { RGB } from './types';

type ColorInRangeContext = {
    start: RGB | string,
    end: RGB | string,
    rangeMin?: number,
    rangeMax: number,
    rangeValue: number
};

export function getColorInRange(ctx: ColorInRangeContext): RGB {
    const start = typeof ctx.start === 'string' ? hexToRgb(ctx.start) : ctx.start;
    const end = typeof ctx.end === 'string' ? hexToRgb(ctx.end) : ctx.end;

    const rangeMin = ctx.rangeMin || 0;

    const percent = (ctx.rangeValue - rangeMin) / (ctx.rangeMax - rangeMin);

    const r = Math.round((percent * (end.r - start.r)) + start.r);
    const g = Math.round((percent * (end.g - start.g)) + start.g);
    const b = Math.round((percent * (end.b - start.b)) + start.b);

    return {
        r,
        g,
        b,
    };
}
