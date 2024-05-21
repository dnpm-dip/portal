type RGB = {
    r: number,
    g: number,
    b: number
};

export function generateRandomColor() {
    return `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;
}

function hexToRgb(hex: string) : RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new SyntaxError('The input is not a valid hex string.');
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
}

export function rgbToHex(rgb: RGB) : string {
    return `#${((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).slice(1)}`;
}

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

export function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `#${intToRGB(hash)}`;
}

function intToRGB(i: number) {
    const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.substring(0, 6 - c.length) + c;
}
