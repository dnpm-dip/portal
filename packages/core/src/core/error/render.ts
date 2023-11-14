import { isClientError } from 'hapic';
import { h } from 'vue';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { APIClientErrorIssueSeverity, extractAPIClientErrorIssues } from '../api-client';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import type {
    ErrorCollectionSlotProps, ErrorRenderContext, ErrorRenderElement, ErrorSlotProps,
} from './types';

const toAlertClass = (severity: APIClientErrorIssueSeverity) => {
    switch (severity) {
        case 'warning': {
            return 'alert-warning';
        }
        default: {
            return 'alert-danger';
        }
    }
};

export function renderError(context: ErrorRenderContext) : VNodeChild {
    const data : ErrorRenderElement[] = [];

    if (isClientError(context.error)) {
        const issues = extractAPIClientErrorIssues(context.error);
        for (let i = 0; i < issues.length; i++) {
            data.push({
                severity: issues[i].severity,
                message: issues[i].details,
            });
        }
    }

    if (data.length === 0) {
        data.push({
            message: context.error.message,
            severity: APIClientErrorIssueSeverity.ERROR,
        });
    }

    if (
        context.slotCollectionName &&
        hasNormalizedSlot(context.slotCollectionName, context.slots)
    ) {
        return normalizeSlot(
            context.slotCollectionName,
            { data } satisfies ErrorCollectionSlotProps,
            context.slots,
        );
    }

    const output : VNodeArrayChildren = [];

    if (hasNormalizedSlot(context.slotName, context.slots)) {
        for (let i = 0; i < data.length; i++) {
            output.push(normalizeSlot(
                context.slotName,
                { data: data[i] } satisfies ErrorSlotProps,
                context.slots,
            ));
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            // todo: tag and class should be configurable
            output.push(h('div', {
                class: [
                    'alert alert-sm alert-warning mb-2',
                    toAlertClass(data[i].severity),
                ],
            }, [
                data[i].message,
            ]));
        }
    }

    return output;
}
