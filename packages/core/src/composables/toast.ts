import { useToast as useVuecsToast } from '@vuecs/overlays';
import { isClientError } from 'hapic';
import { isObject } from 'smob';
import { APIClientErrorIssueSeverity, extractAPIClientErrorIssues } from '../core';

type LegacyVariant = 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary' | 'light' | 'dark';
type VuecsColor = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';

function variantToColor(variant?: string): VuecsColor {
    switch (variant) {
        case 'success': return 'success';
        case 'warning': return 'warning';
        case 'danger': return 'error';
        case 'info': return 'info';
        case 'primary': return 'primary';
        default: return 'neutral';
    }
}

type ToastInput = {
    body?: string;
    title?: string;
    variant?: LegacyVariant;
    [key: string]: unknown;
};

type UseToastReturn = {
    show: (el: string | ToastInput, options?: ToastInput) => unknown;
    showError: (error: Error, options?: ToastInput) => void;
};

export function useToast(): UseToastReturn {
    const toast = useVuecsToast();

    const showImpl = (opts: ToastInput) => toast.add({
        title: opts.title,
        description: opts.body,
        color: variantToColor(opts.variant),
    });

    const show = (
        el: string | ToastInput,
        options: ToastInput = {},
    ) => {
        if (isObject(el)) {
            return showImpl(el as ToastInput);
        }

        return showImpl({
            ...options,
            body: el,
        });
    };
    const showError = (
        error: Error,
        options: ToastInput = {},
    ) => {
        if (isClientError(error)) {
            const issues = extractAPIClientErrorIssues(error);
            if (issues.length > 0) {
                for (const issue of issues) {
                    let variant: LegacyVariant;
                    switch (issue.severity) {
                        case APIClientErrorIssueSeverity.WARNING: {
                            variant = 'warning';
                            break;
                        }
                        default: {
                            variant = 'danger';
                        }
                    }

                    show(issue.details, {
                        variant,
                        ...options,
                    });
                }

                return;
            }
        }

        show(error.message, {
            variant: 'danger',
            ...options,
        });
    };

    return {
        show,
        showError,
    };
}
