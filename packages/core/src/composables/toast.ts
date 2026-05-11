import type { ColorVariant, ToastOrchestratorParam } from 'bootstrap-vue-next';
import { useToast as _useToast } from 'bootstrap-vue-next';
import { isClientError } from 'hapic';
import { isObject } from 'smob';
import { APIClientErrorIssueSeverity, extractAPIClientErrorIssues } from '../core';

type ToastInput = ToastOrchestratorParam;

type UseToastReturn = {
    show: (el: string | ToastInput, options?: ToastInput) => unknown;
    showError: (error: Error, options?: ToastInput) => void;
};

export function useToast(): UseToastReturn {
    const toast = _useToast();

    const show = (
        el: string | ToastInput,
        options: ToastInput = {},
    ) => {
        if (typeof toast.create === 'undefined') {
            return undefined;
        }

        if (isObject(el)) {
            return toast.create({
                position: 'top-center',
                ...el,
            });
        }

        return toast.create({
            position: 'top-center',
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
                    let variant: ColorVariant;
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
