import type { Slots } from 'vue';
import type { APIClientErrorIssueSeverity } from '@dnpm-dip/http-kit';

export type ErrorRenderContext = {
    slots: Slots,
    slotName: string,
    slotCollectionName?: string,
    error: Error,
};

export type ErrorRenderElement = {
    message: string,
    severity: APIClientErrorIssueSeverity,
};

export type ErrorCollectionSlotProps = {
    data: ErrorRenderElement[]
};

export type ErrorSlotProps = {
    data: ErrorRenderElement
};
