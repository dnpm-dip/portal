import type { SetupContext, VNodeChild } from 'vue';
import { hasNormalizedSlot, normalizeSlot } from './slot';

type RenderContext<T> = {
    alt?: VNodeChild | ((data: T) => VNodeChild),
    setup?: SetupContext,
    slotName?: string,
    slotProps: T
};

export type ContentRenderContext<T = Record<string, any>> = Omit<RenderContext<T>, 'slotName' | 'slotProps'> & {
    data: T
};

export type ErrorRenderContext<T = Error> = Omit<RenderContext<T>, 'slotName' | 'slotProps'> & {
    error: T
};

function render<T>(context: RenderContext<T>) : VNodeChild {
    const slotName = context.slotName || 'default';

    if (context.setup) {
        if (hasNormalizedSlot(slotName, context.setup.slots)) {
            return normalizeSlot(slotName, context.slotProps || {}, context.setup.slots);
        }
    }

    return typeof context.alt === 'function' ?
        context.alt(context.slotProps) :
        context.alt;
}

export function renderContent<T>(context: ContentRenderContext<T>) : VNodeChild {
    return render({
        ...context,
        slotProps: context.data,
        slotName: 'default',
    });
}

export function renderError<T>(context: ErrorRenderContext<T>) : VNodeChild {
    return render({
        ...context,
        slotProps: context.error,
        slotName: 'error',
    });
}
