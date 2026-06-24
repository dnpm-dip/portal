import { isClientError } from 'hapic';
import { h } from 'vue';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { VCAlert } from '@vuecs/elements';
import { APIClientErrorIssueSeverity, extractAPIClientErrorIssues } from '../http-client';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import type {
    ErrorCollectionSlotProps,
    ErrorRenderContext,
    ErrorRenderElement,
    ErrorSlotProps,
} from './types';

const toAlertColor = (severity: APIClientErrorIssueSeverity) => {
    switch (severity) {
        case 'warning': {
            return 'warning';
        }
        default: {
            return 'error';
        }
    }
};

export function renderError(context: ErrorRenderContext) : VNodeChild {
    const data : ErrorRenderElement[] = [];

    if (isClientError(context.error)) {
        const issues = extractAPIClientErrorIssues(context.error);
        for (const issue of issues) {
            data.push({
                severity: issue.severity,
                message: issue.details,
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
        for (const item of data) {
            output.push(normalizeSlot(
                context.slotName,
                { data: item } satisfies ErrorSlotProps,
                context.slots,
            ));
        }
    } else {
        for (const item of data) {
            output.push(h(VCAlert, {
                color: toAlertColor(item.severity),
                variant: 'soft',
                size: 'sm',
                class: 'mb-2',
            }, () => item.message));
        }
    }

    return output;
}
