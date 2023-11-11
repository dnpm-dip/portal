import type { SetupContext, VNodeChild } from 'vue';
import { hasNormalizedSlot, normalizeSlot } from './slot';

type RenderContext = {
    template?: VNodeChild | (() => VNodeChild),
    setup?: SetupContext,
    slotName?: string,
    slotProps?: Record<string, any>
};

export type ContentRenderContext = Omit<RenderContext, 'slotName' | 'slotProps'> & {
    data: Record<string, any>,
    busy?: boolean,
    load?: () => Promise<any>
};

export type ErrorRenderContext = Omit<RenderContext, 'slotName' | 'slotProps'> & {
    error: Error
};

function render(context: RenderContext) : VNodeChild {
    const slotName = context.slotName || 'default';

    if (context.setup) {
        if (hasNormalizedSlot(slotName, context.setup.slots)) {
            return normalizeSlot(slotName, context.slotProps || {}, context.setup.slots);
        }
    }

    return typeof context.template === 'function' ?
        context.template() :
        context.template;
}

export function renderDefault(context: ContentRenderContext) : VNodeChild {
    return render({
        ...context,
        slotProps: {
            data: context.data,
            busy: context.busy,
            load: context.load,
        },
        slotName: 'default',
    });
}

export function renderLoading(context: RenderContext) : VNodeChild {
    return render({
        ...context,
        slotName: 'loading',
    });
}

export function renderError(context: ErrorRenderContext) : VNodeChild {
    return render({
        ...context,
        slotProps: {
            error: context.error,
        },
        slotName: 'error',
    });
}
