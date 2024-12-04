import type { ColorVariant, OrchestratedToast } from 'bootstrap-vue-next';
import { useToastController as _useToast } from 'bootstrap-vue-next';
import { isClientError } from 'hapic';
import { isObject } from 'smob';
import { APIClientErrorIssueSeverity, extractAPIClientErrorIssues } from '../core';

export function useToast() {
    const toast = _useToast();

    const show = (
        el: string | OrchestratedToast,
        options: OrchestratedToast = {},
    ) => {
        if (typeof toast.show === 'undefined') {
            return Symbol('');
        }

        if (isObject(el)) {
            el.pos = el.pos || 'top-center';
            return toast.show({
                props: el,
            });
        }

        options.pos = options.pos || 'top-center';

        return toast.show({
            props: {
                ...(options || {}),
                body: el,
            },
        });
    };
    const showError = (
        error: Error,
        options: OrchestratedToast = {},
    ) => {
        if (isClientError(error)) {
            const issues = extractAPIClientErrorIssues(error);
            if (issues.length > 0) {
                for (let i = 0; i < issues.length; i++) {
                    let variant: ColorVariant;
                    switch (issues[i].severity) {
                        case APIClientErrorIssueSeverity.WARNING: {
                            variant = 'warning';
                            break;
                        }
                        default: {
                            variant = 'danger';
                        }
                    }

                    show(issues[i].details, {
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
        hide(el: symbol) {
            if (typeof toast.remove === 'undefined') {
                return;
            }

            toast.remove(el);
        },
        show,
        showError,
    };
}
