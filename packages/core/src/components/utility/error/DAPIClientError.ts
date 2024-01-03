import type { PropType, SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { ErrorCollectionSlotProps, ErrorSlotProps } from '../../../core';
import { renderError } from '../../../core';

export default defineComponent({
    props: {
        error: {
            type: Object as PropType<Error>,
            required: true,
        },
    },
    slots: Object as SlotsType<{
        error: ErrorSlotProps,
        errors: ErrorCollectionSlotProps
    }>,
    setup(props, { slots }) {
        return () => renderError({
            slots,
            slotName: 'error',
            slotCollectionName: 'errors',
            error: props.error,
        });
    },
});
